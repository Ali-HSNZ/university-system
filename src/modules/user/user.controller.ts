import { Request, Response, NextFunction } from 'express'
import { Controller, Delete, Get, Put } from '../../decorators/router.decorator'
import userServices from './user.services'
import httpStatus from 'http-status'
import { TRegisterStudentFilesType } from '../auth/auth.types'
import { validationHandling } from '../../core/utils/validation-handling'
import degreeServices from '../degree/degree.services'
import departmentServices from '../department/department.services'
import userUtils from './user.utils'
import updateUserValidation from './user.validation'

@Controller('/users')
class UserController {
    @Get('/')
    async getAll(req: Request, res: Response) {
        const users = await userServices.getAll()
        res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: 'عملیات با موفقیت انجام شد',
            data: users
        })
    }

    @Get('/search')
    async search(req: Request, res: Response) {
        const users = await userServices.search(req.query)

        res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: 'عملیات با موفقیت انجام شد',
            data: users
        })
    }

    @Get('/:id/info')
    async getInfo(req: Request, res: Response) {
        const id = req.params.id

        if (isNaN(Number(id))) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: httpStatus.BAD_REQUEST,
                message: 'شناسه کاربر معتبر نیست'
            })
        }

        const user = await userServices.getById(Number(id))

        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: httpStatus.NOT_FOUND,
                message: 'کاربر یافت نشد'
            })
        }

        res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: 'عملیات با موفقیت انجام شد',
            data: user
        })
    }

    @Put('/:id/update')
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id

            console.log('id', id)

            if (isNaN(Number(id))) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: httpStatus.BAD_REQUEST,
                    message: 'شناسه کاربر معتبر نیست'
                })
            }

            const files = req.files as TRegisterStudentFilesType

            req.body.national_card_image = files?.['national_card_image']?.[0]
            req.body.birth_certificate_image = files?.['birth_certificate_image']?.[0]
            req.body.military_service_image = files?.['military_service_image']?.[0]
            req.body.avatar = files?.['avatar']?.[0]

            const user = await userServices.checkExistById(Number(id))

            await validationHandling(req.body, updateUserValidation(user?.dataValues.role, user?.dataValues.gender))

            if (!user) {
                throw new Error('کاربر در سیستم وجود ندارد')
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

            const userData = userUtils.getSpecialUserData({
                data: req.body,
                usersCount: 0
            })

            const updatedUser = await userServices.update(Number(id), userData)

            if (updatedUser) {
                return res.status(httpStatus.CREATED).json({
                    status: httpStatus.CREATED,
                    message: 'ویرایش با موفقیت انجام شد'
                })
            } else {
                throw new Error('ویرایش با مشکل مواجه شد')
            }
        } catch (error) {
            // console.log('error', error)
            next(error)
        }
    }

    @Delete('/:id/delete')
    async delete(req: Request, res: Response) {
        const id = req.params.id

        if (isNaN(Number(id))) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: httpStatus.BAD_REQUEST,
                message: 'شناسه کاربر معتبر نیست'
            })
        }

        const user = await userServices.delete(Number(id))

        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: httpStatus.NOT_FOUND,
                message: 'کاربر یافت نشد'
            })
        }

        return res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: 'عملیات با موفقیت انجام شد'
        })
    }
}

export default new UserController()
