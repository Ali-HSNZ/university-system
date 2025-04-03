import { NextFunction, Request, Response } from 'express'

const serializeArray = (...fields: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fields.forEach((field) => {
            let value = req.body[field]

            if (typeof value === 'string') {
                req.body[field] = [
                    ...new Set(
                        value
                            .split(/[#,\s]+/)
                            .map((item) => item.trim())
                            .filter(Boolean)
                    )
                ]
            } else if (Array.isArray(value)) {
                req.body[field] = [
                    ...new Set(value.map((item) => (typeof item === 'string' ? item.trim() : item)).filter(Boolean))
                ]
            } else {
                req.body[field] = []
            }
        })

        next()
    }
}

export default serializeArray
