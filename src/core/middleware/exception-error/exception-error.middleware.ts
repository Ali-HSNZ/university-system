import { Express } from 'express'
import fs from 'fs'
import httpStatus from 'http-status'
import { ValidationError } from 'yup'

const exceptionErrorMiddleware = (app: Express) => {
    app.use((error: any, req: any, res: any, next: any) => {
        //  remove file(s) if exists
        if (Object.keys(req?.files || []).length > 0) {
            Object.values(req.files).forEach((file: any) => {
                if (fs.existsSync(file[0].path)) fs.unlinkSync(file[0].path)
            })
        } else if (fs.existsSync(req?.file?.path)) {
            fs.unlinkSync(req?.file?.path)
        }

        // handle validation error
        if (error instanceof ValidationError) {
            const validationError = error as any
            const formattedErrors = Object.fromEntries(
                validationError.inner.map((err: any) => [err.path, err.message]).filter(([path]: any) => path)
            )
            return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
                code: httpStatus.UNPROCESSABLE_ENTITY,
                message: 'اطلاعات وارد شده معتبر نیست',
                errors: formattedErrors
            })
        }

        // handle other errors
        const status = error?.status || httpStatus.INTERNAL_SERVER_ERROR
        const message = error?.message || 'خطای سرور'
        return res.status(status).json({
            status,
            message
        })
    })
}

export default exceptionErrorMiddleware
