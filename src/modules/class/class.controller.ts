import { Request, Response, NextFunction } from 'express'
import { Controller, Get, Post } from '../../decorators/router.decorator'
import { validationHandling } from '../../core/utils/validation-handling'
import classSchema from './class.validation'
import classService from './class.service'
import httpStatus from 'http-status'
import { checkValidId } from '../../core/utils/check-valid-id'

@Controller('/class')
class ClassController {
    @Get('/list')
    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const classes = await classService.list()

            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: classes
            })
        } catch (error) {
            next(error)
        }
    }

    @Get('/:id/info')
    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            checkValidId(id)

            const existClass = await classService.findOne(Number(id))

            if (!existClass) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: httpStatus.NOT_FOUND,
                    message: 'کلاس یافت نشد'
                })
            }

            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: existClass
            })
        } catch (error) {
            next(error)
        }
    }

    @Post('/create')
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            await validationHandling(req.body, classSchema)

            await classService.create(req.body)

            return res.status(httpStatus.CREATED).json({
                status: httpStatus.CREATED,
                message: 'عملیات با موفقیت انجام شد'
            })
        } catch (error) {
            next(error)
        }
    }
}

export default ClassController
