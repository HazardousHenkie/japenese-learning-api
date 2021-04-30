import { UserRequest } from '../types/words'
import { Response, NextFunction, RequestHandler } from 'express'

const catchAsync = (fn: RequestHandler) => (
    req: UserRequest,
    res: Response,
    next: NextFunction
) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err))
}

export default catchAsync
