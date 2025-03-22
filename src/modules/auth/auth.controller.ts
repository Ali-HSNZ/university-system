import { Request, Response, NextFunction } from 'express'
import { Controller, Post, UseMiddleware } from '../../decorators/router.decorator'
import registerValidation from './auth.validation'
import { errorHandling } from '../../core/utils/error-handling'
import httpStatus from 'http-status'
import authServices from './auth.services'
import { fileUpload } from '../../core/utils/file-upload'
import { TRegisterFilesType } from './auth.types'
import userServices from '../user/user.services'

@Controller('/auth')
class AuthController {
    @Post('/register')
    @UseMiddleware(
        fileUpload.fields([
            { name: 'national_code_image', maxCount: 1 },
            { name: 'military_image', maxCount: 1 },
            { name: 'avatar', maxCount: 1 }
        ])
    )
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const files = req.files as TRegisterFilesType

            req.body.national_code_image = files?.['national_code_image']?.[0]
            req.body.military_image = files?.['military_image']?.[0]
            req.body.avatar = files?.['avatar']?.[0]

            await registerValidation(req.body.role, req.body.gender).validate(req.body, {
                abortEarly: false
            })

            const existUser = await authServices.checkExistUser({
                national_code: req.body.national_code,
                phone: req.body.phone,
                email: req.body.email
            })

            if (existUser) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: httpStatus.BAD_REQUEST,
                    message: 'کاربر وارد شده قبلا ثبت نام کرده است'
                })
            }

            if (req.body?.degree_id) {
                const existDegree = await authServices.checkExistDegree(req.body.degree_id)
                if (!existDegree) {
                    return res.status(httpStatus.BAD_REQUEST).json({
                        status: httpStatus.BAD_REQUEST,
                        message: 'مقطع تحصیلی وارد شده وجود ندارد'
                    })
                }
            }

            if (req.body?.department_id) {
                const existDepartment = await authServices.checkExistDepartment(req.body.department_id)
                if (!existDepartment) {
                    return res.status(httpStatus.BAD_REQUEST).json({
                        status: httpStatus.BAD_REQUEST,
                        message: 'گروه آموزشی وارد شده وجود ندارد'
                    })
                }
            }

            const allUsersCount = await userServices.getUsersCount()

            const userData = authServices.getSpecialUserData({
                data: req.body,
                allUsersCount
            })

            const createdUser = await authServices.create(userData!)

            if (createdUser) {
                return res
                    .status(httpStatus.CREATED)
                    .json({ status: httpStatus.CREATED, message: 'ثبت نام با موفقیت انجام شد' })
            } else {
                return res
                    .status(httpStatus.BAD_REQUEST)
                    .json({ status: httpStatus.BAD_REQUEST, message: 'ثبت نام با مشکل مواجه شد' })
            }
        } catch (error) {
            errorHandling(error, res)
        }
    }
}

export default new AuthController()
