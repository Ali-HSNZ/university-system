import { NextFunction, Request, Response } from 'express'
import { Controller, Delete, Get, Put } from '../../decorators/router.decorator'
import userServices from './user.service'
import httpStatus from 'http-status'
import { checkValidId } from '../../core/utils/check-valid-id'
import { TAuthenticatedRequestType } from '../../core/types/auth'

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
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id
            checkValidId(id)
            const data = req.body

            await userServices.update(Number(id), data)

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

