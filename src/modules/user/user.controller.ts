import { Request, Response, NextFunction } from 'express'
import { Controller, Delete, Get, Put } from '../../decorators/router.decorator'
import userServices from './user.services'
import httpStatus from 'http-status'

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
