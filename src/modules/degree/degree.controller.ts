import { Request, Response } from 'express'
import httpStatus from 'http-status'
import degreeServices from './degree.services'
import { Controller, Delete, Get, Post, Put } from '../../decorators/router.decorator'
import { checkValidId } from '../../core/utils/check-valid-id'

@Controller('/degree')
class DegreeController {
    @Get('/list')
    async getAll(req: Request, res: Response) {
        const degrees = await degreeServices.findAll()
        res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: 'عملیات با موفقیت انجام شد',
            data: degrees
        })
    }

    @Get('/:id/info')
    async getById(req: Request, res: Response) {
        const { id } = req.params
        checkValidId(id)

        const degree = await degreeServices.checkExistId(id)

        if (!degree) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: httpStatus.BAD_REQUEST,
                message: 'مقطع تحصیلی یافت نشد'
            })
        }
        res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: 'عملیات با موفقیت انجام شد',
            data: degree
        })
    }

    @Post('/create')
    async create(req: Request, res: Response) {
        const { name } = req.body
        const existDegree = await degreeServices.checkExistName(name)
        if (existDegree) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: httpStatus.BAD_REQUEST,
                message: 'این مقطع تحصیلی قبلا ثبت شده است'
            })
        }

        const degree = await degreeServices.create(name)

        if (!degree) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: httpStatus.BAD_REQUEST,
                message: 'عملیات با مشکل مواجه شد'
            })
        }
        res.status(httpStatus.CREATED).json({
            status: httpStatus.CREATED,
            message: 'مقطع تحصیلی با موفقیت ثبت شد'
        })
    }

    @Put('/:id/update')
    async update(req: Request, res: Response) {
        const { id } = req.params
        checkValidId(id)

        const { name } = req.body
        const existDegree = await degreeServices.checkExistId(id)
        if (!existDegree) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: httpStatus.BAD_REQUEST,
                message: 'مقطع تحصیلی یافت نشد'
            })
        }
        const updatedDegree = await degreeServices.update(id, name)
        if (!updatedDegree) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: httpStatus.BAD_REQUEST,
                message: 'عملیات با مشکل مواجه شد'
            })
        }
        res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: 'مقطع تحصیلی با موفقیت به روز شد'
        })
    }

    @Delete('/:id/delete')
    async delete(req: Request, res: Response) {
        const { id } = req.params
        checkValidId(id)

        const existDegree = await degreeServices.checkExistId(id)
        if (!existDegree) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: httpStatus.BAD_REQUEST,
                message: 'مقطع تحصیلی یافت نشد'
            })
        }

        const users = await degreeServices.checkUsersWithDegree(id)
        if (users) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: httpStatus.BAD_REQUEST,
                data: {
                    dependencies: users
                },
                message: 'مقطع تحصیلی دارای کاربر است'
            })
        }

        const degree = await degreeServices.delete(id)
        if (!degree) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: httpStatus.BAD_REQUEST,
                message: 'عملیات با مشکل مواجه شد'
            })
        }
        res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: 'مقطع تحصیلی با موفقیت حذف شد'
        })
    }
}

export default new DegreeController()
