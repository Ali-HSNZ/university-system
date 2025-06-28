import { NextFunction, Request, Response } from 'express'
import { Controller, Delete, Get, Put, UseMiddleware } from '../../decorators/router.decorator'
import userServices from './user.service'
import httpStatus from 'http-status'
import { checkValidId } from '../../core/utils/check-valid-id'
import { TAuthenticatedRequestType } from '../../core/types/auth'
import { fileUpload } from '../../core/utils/file-upload'
import { serializeFilePath } from '../../core/utils/serialize-file-path'
import { hashString } from '../../core/utils/hash-string'
import { updateUserValidation, updateUserPasswordValidation } from './user.validations'
import { validationHandling } from '../../core/utils/validation-handling'
import { TUpdateUserPasswordInferType } from './user.types'

@Controller('/user')
class UserController {
    @Get('/list')
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

    @Get('/info')
    async getCurrentUserInfo(req: TAuthenticatedRequestType, res: Response) {
        const id = req.user?.id
        checkValidId(id)

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

    @Put('/:id/update')
    @UseMiddleware(fileUpload.single('avatar'))
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id
            checkValidId(id)

            req.body.avatar = req.file
            await validationHandling(req.body, updateUserValidation)

            const hashedPassword = req?.body?.password ? hashString(req.body.password) : undefined

            await userServices.update(Number(id), {
                ...req.body,
                avatar: serializeFilePath(req?.file?.path),
                password: hashedPassword
            })

            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد'
            })
        } catch (error) {
            next(error)
        }
    }

    @Put('/profile/update-password')
    async updatePassword(req: TAuthenticatedRequestType, res: Response, next: NextFunction) {
        try {
            const id = req.user?.id
            checkValidId(id)

            const data = await validationHandling<TUpdateUserPasswordInferType>(req.body, updateUserPasswordValidation)

            await userServices.updatePassword(Number(id), data)

            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد'
            })
        } catch (error) {
            next(error)
        }
    }
}

export default new UserController()


