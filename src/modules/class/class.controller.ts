import { Request, Response, NextFunction } from 'express'
import { Controller, Delete, Get, Post } from '../../decorators/router.decorator'
import { validationHandling } from '../../core/utils/validation-handling'
import classSchema from './class.validation'
import classService from './class.service'
import httpStatus from 'http-status'
import { checkValidId } from '../../core/utils/check-valid-id'
import TClassInferType from './class.types'

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
            const  data = await validationHandling<TClassInferType>(req.body, classSchema)

            const existClass = await classService.existClass({
                course_id: data.course_id,
                semester_id: data.semester_id
            })

            if (existClass) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: httpStatus.BAD_REQUEST,
                    message: 'کلاس با این درس و ترم قبلاً ایجاد شده است'
                })
            }

            await classService.create(req.body)
            return res.status(httpStatus.CREATED).json({
                status: httpStatus.CREATED,
                message: 'عملیات با موفقیت انجام شد'
            })
        } catch (error) {
            next(error)
        }
    }

    @Delete('/:id/delete')
    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            checkValidId(id)

            const existClass = await classService.checkExist(Number(id))

            if (!existClass) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: httpStatus.NOT_FOUND,
                    message: 'کلاس یافت نشد'
                })
            }

            await classService.delete(Number(id))

            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد'
            })
        } catch (error) {
            next(error)
        }
    }
}

export default ClassController
