import { NextFunction, Request, Response } from 'express'
import { UserModel } from '../../../models/user.model'
import jwt from 'jsonwebtoken'
import { APP_ENV } from '../../config/dotenv.config'
import httpStatus from 'http-status'

const getToken = (headers: any) => {
    const [bearer, token] = headers?.authorization?.split(' ') || []

    if (token && bearer.toLowerCase() === 'bearer') {
        return token
    }
}

const AuthenticateMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = getToken(req.headers)

        if (!token) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                status: httpStatus.UNAUTHORIZED,
                message: 'حساب کاربری شناسایی نشد. وارد حساب کاربری خود شوید'
            })
        }

        const secretKey = APP_ENV.token.secretKey
        jwt.verify(token, secretKey, async (err: any, payload: any) => {
            try {
                // check initial error
                if (err) {
                    return res.status(httpStatus.UNAUTHORIZED).json({
                        status: httpStatus.UNAUTHORIZED,
                        message: 'حساب کاربری شناسایی نشد. وارد حساب کاربری خود شوید'
                    })
                }

                // find user from DB with mobile
                const user = await UserModel.findOne({ where: { national_code: payload.nationalCode } })

                //  if not Exist User throw error
                if (!user) {
                    return res.status(httpStatus.UNAUTHORIZED).json({
                        status: httpStatus.UNAUTHORIZED,
                        message: 'مجددا وارد حساب کاربری خود شوید'
                    })
                }
                // save user info to req
                ;(req as any).user = user.dataValues

                return next()
            } catch (error) {
                return next(error)
            }
        })
    } catch (error) {
        return next(error)
    }
}

export default AuthenticateMiddleware
