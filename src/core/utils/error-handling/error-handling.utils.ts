import { Response } from 'express'
import { ValidationError } from 'yup'
import httpStatus from 'http-status'
import fs from 'fs'

const extractFilePaths = (error: unknown): string[] => {
    if (!error || typeof error !== 'object') return []

    return Object.values(error)
        .flatMap((value) => (typeof value === 'object' && value !== null ? Object.values(value) : []))
        .filter((file) => file && typeof file === 'object' && 'path' in file && typeof file.path === 'string')
        .map((file: any) => file.path)
}

const errorHandling = (error: unknown, res: Response) => {
    const fileExists: string[] = extractFilePaths(error)
    if (fileExists.length) {
        fileExists.forEach((filePath) => {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
        })
    }

    if (error instanceof ValidationError) {
        const formattedErrors = Object.fromEntries(
            error.inner.map((err) => [err.path, err.message]).filter(([path]) => path)
        )

        return res.status(422).json({
            status: 422,
            message: 'اطلاعات وارد شده معتبر نیست',
            errors: formattedErrors
        })
    }

    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: error instanceof Error ? error.message : 'خطایی نامشخص رخ داده است'
    })
}

export default errorHandling
