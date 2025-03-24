import { Request, Response, NextFunction } from 'express'
import { Controller, Post, UseMiddleware } from '../../decorators/router.decorator'
import registerValidation from './auth.validation'
import httpStatus from 'http-status'
import authServices from './auth.services'
import { fileUpload } from '../../core/utils/file-upload'
import { TRegisterFilesType } from './auth.types'
import userServices from '../user/user.services'
import authUtils from './auth.utils'
import { validationHandling } from '../../core/utils/validation-handling'
import { tokenGenerator } from '../../core/utils/token-generator'
import degreeServices from '../degree/degree.services'
import departmentServices from '../department/department.services'

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

            await validationHandling(req.body, registerValidation(req.body.role, req.body.gender))

            const existUser = await userServices.findOne({
                national_code: req.body.national_code,
                phone: req.body.phone,
                email: req.body.email
            })

            if (existUser) {
                throw new Error('کاربر در سیستم وجود دارد')
            }

            if (req.body?.degree_id) {
                const existDegree = await degreeServices.checkExist(req.body.degree_id)
                if (!existDegree) {
                    throw new Error('مقطع تحصیلی وارد شده وجود ندارد')
                }
            }

            if (req.body?.department_id) {
                const existDepartment = await departmentServices.checkExist(req.body.department_id)
                if (!existDepartment) {
                    throw new Error('گروه آموزشی وارد شده وجود ندارد')
                }
            }

            const usersCount = await userServices.count()

            const userData = authUtils.getSpecialUserData({
                data: req.body,
                usersCount
            })

            const register = await authServices.register(userData!)

            const token = tokenGenerator({
                nationalCode: userData?.national_code
            })

            if (register) {
                return res.status(httpStatus.CREATED).json({
                    status: httpStatus.CREATED,
                    data: { token },
                    message: 'ثبت نام با موفقیت انجام شد'
                })
            }

            throw new Error('ثبت نام با مشکل مواجه شد')
        } catch (error) {
            next(error)
        }
    }
}

export default new AuthController()
