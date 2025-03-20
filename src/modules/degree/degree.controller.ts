import { Request, Response } from 'express'
import httpStatus from 'http-status'
import degreeServices from './degree.services'
import { Controller, Delete, Get, Post } from '../../decorators/router.decorator'

@Controller('/degrees')
class DegreeController {
    @Get()
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
        const { degree_name } = req.body
        const existDegree = await degreeServices.checkExistName(degree_name)
        if (existDegree) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: httpStatus.BAD_REQUEST,
                message: 'این مقطع تحصیلی قبلا ثبت شده است'
            })
        }

        const degree = await degreeServices.create(degree_name)

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

    @Delete('/:id/delete')
    async delete(req: Request, res: Response) {
        const { id } = req.params

        const existDegree = await degreeServices.checkExistId(id)
        if (!existDegree) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: httpStatus.BAD_REQUEST,
                message: 'مقطع تحصیلی یافت نشد'
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
