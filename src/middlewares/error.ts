import mongoose from 'mongoose'
import httpStatus from 'http-status'
import config from '../config/config'
import logger from '../config/logger'
import ApiError from '../utils/ApiError'
import { Response, NextFunction } from 'express'
import { UserRequest } from '../types/words'

export const errorConverter = (
    err: ApiError | Error,
    req: UserRequest,
    res: Response,
    next: NextFunction
) => {
    let error = err
    if (!(error instanceof ApiError)) {
        const statusCode =
            (error as ApiError).statusCode ||
            (error as mongoose.Error) instanceof mongoose.Error
                ? httpStatus.BAD_REQUEST
                : httpStatus.INTERNAL_SERVER_ERROR
        const message = (error as ApiError).message || httpStatus[statusCode]
        error = new ApiError(statusCode, String(message), false, err.stack)
    }
    next(error)
}

export const errorHandler = (
    err: ApiError,
    req: UserRequest,
    res: Response,
    next?: NextFunction
) => {
    let { statusCode, message } = err
    if (config.env === 'production' && !err.isOperational) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR
        message = String(httpStatus[httpStatus.INTERNAL_SERVER_ERROR])
    }

    res.locals.errorMessage = err.message

    const response = {
        code: statusCode,
        message,
        ...(config.env === 'development' && { stack: err.stack }),
    }

    if (config.env === 'development') {
        logger.error(err)
    }

    res.status(statusCode).send(response)
}
