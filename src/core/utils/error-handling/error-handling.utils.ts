import { Response } from 'express'
import { ValidationError } from 'yup'
import httpStatus from 'http-status'

const errorHandling = (error: ValidationError | unknown, res: Response) => {
    if (error instanceof ValidationError) {
        const formattedErrors: Record<string, string> = {}
        error.inner.forEach((err) => {
            if (err.path) formattedErrors[err.path] = err.message
        })
        res.status(httpStatus.BAD_REQUEST).json({
            status: 'error',
            message: 'اطلاعات وارد شده معتبر نیست',
            errors: formattedErrors
        })
    }
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'خطایی نامشخص رخ داده است' })
}

export default errorHandling
