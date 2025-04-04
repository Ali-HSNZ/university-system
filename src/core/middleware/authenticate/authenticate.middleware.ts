import { NextFunction, Request, Response } from 'express'
import { UserModel } from '../../../models/user.model'
import jwt from 'jsonwebtoken'
import { APP_ENV } from '../../config/dotenv.config'

const getToken = (headers: any) => {
    const [bearer, token] = headers?.authorization?.split(' ') || []

    if (token && bearer.toLowerCase() === 'bearer') return token
    throw new Error('حساب کاربری شناسایی نشد. وارد حساب کاربری خود شوید')
}

const AuthenticateMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = getToken(req.headers)
        const secretKey = APP_ENV.token.secretKey
        jwt.verify(token, secretKey, async (err: any, payload: any) => {
            try {
                // check initial error
                if (err) throw new Error('مجددا وارد حساب کاربری خود شوید')

                // find user from DB with mobile
                const user = await UserModel.findOne({ where: { national_code: payload.nationalCode } })

                //  if not Exist User throw error
                if (!user) {
                    throw new Error('مجددا وارد حساب کاربری خود شوید')
                }
                // save user info to req
                ;(req as any).user = user.dataValues

                return next()
            } catch (error) {
                next(error)
            }
        })
    } catch (error) {
        next(error)
    }
}

export default AuthenticateMiddleware
