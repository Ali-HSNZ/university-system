import { Response } from 'express'
import { ValidationError } from 'yup'

const errorHandling = (error: ValidationError | unknown, res: Response) => {
    if (error instanceof ValidationError) {
        const formattedErrors: Record<string, string> = {}
        error.inner.forEach((err) => {
            if (err.path) formattedErrors[err.path] = err.message
        })
        res.status(400).json({
            status: 'error',
            message: 'اطلاعات وارد شده معتبر نیست',
            errors: formattedErrors
        })
    }
    res.status(500).json({ message: 'خطایی نامشخص رخ داده است' })
}

export default errorHandling
