import httpStatus from 'http-status'
import pick from '../utils/pick'
import ApiError from '../utils/ApiError'
import { NextFunction, Response } from 'express'
import Joi from 'joi'
import { UserRequest } from '../types/words'

type Schema = {
    params?: Joi.ObjectSchema<any>
    body?: Joi.ObjectSchema<any>
    query?: Joi.ObjectSchema<any>
}

const validate = (schema: Schema) => (
    req: UserRequest,
    res: Response,
    next: NextFunction
) => {
    const validSchema = pick(schema, ['params', 'query', 'body'])
    const object = pick(req, Object.keys(validSchema))
    const { value, error } = Joi.compile(validSchema)
        .prefs({ errors: { label: 'key' } })
        .validate(object)

    if (error) {
        const errorMessage = error.details
            .map((details) => details.message)
            .join(', ')
        return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage))
    }
    Object.assign(req, value)
    return next()
}

export default validate
