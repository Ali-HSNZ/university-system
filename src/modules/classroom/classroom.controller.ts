import { Controller, Delete, Get, Post, Put } from '../../decorators/router.decorator'
import { Request, Response, NextFunction } from 'express'
import classroomService from './classroom.service'
import httpStatus from 'http-status'
import { checkValidId } from '../../core/utils/check-valid-id'
import { validationHandling } from '../../core/utils/validation-handling'
import TClassroomInferType from './classroom.types'
import classroomSchema from './classroom.validations'

@Controller('/classroom')
class ClassroomController {
    @Get('/list')
    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const classrooms = await classroomService.list()
            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: classrooms
            })
        } catch (error) {
            next(error)
        }
    }

    @Get('/:id/info')
    async info(req: Request, res: Response, next: NextFunction) {
        try {
            const classroomId = req.params.id?.trim()
            checkValidId(classroomId)

            const classroom = await classroomService.getById(classroomId)

            if (!classroom) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: httpStatus.NOT_FOUND,
                    message: 'سالن یافت نشد'
                })
            }

            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: classroom
            })
        } catch (error) {
            next(error)
        }
    }

    @Post('/create')
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await validationHandling<TClassroomInferType>(req.body, classroomSchema)

            const checkExistClassroom = await classroomService.checkExistClassroom({
                name: data.name,
                building_name: data.building_name,
                floor_number: data.floor_number
            })

            if (checkExistClassroom) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: httpStatus.BAD_REQUEST,
                    message: 'سالن قبلا ایجاد شده است'
                })
            }

            await classroomService.create(data)

            return res.status(httpStatus.CREATED).json({
                status: httpStatus.CREATED,
                message: 'عملیات با موفقیت انجام شد'
            })
        } catch (error) {
            next(error)
        }
    }

    @Put('/:id/update')
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const classroomId = req.params.id?.trim()
            checkValidId(classroomId)

            const data = await validationHandling<TClassroomInferType>(req.body, classroomSchema)

            const checkExistClassroom = await classroomService.checkExistClassroomInUpdate(Number(classroomId), {
                name: data.name,
                building_name: data.building_name,
                floor_number: data.floor_number
            })

            if (checkExistClassroom) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: httpStatus.BAD_REQUEST,
                    message: 'سالن قبلا ایجاد شده است'
                })
            }

            await classroomService.update(classroomId, data)

            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد'
            })
        } catch (error) {
            next(error)
        }
    }

    @Delete('/:id/delete')
    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const classroomId = req.params.id?.trim()
            checkValidId(classroomId)

            await classroomService.delete(classroomId)

            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد'
            })
        } catch (error) {
            next(error)
        }
    }
}

export default ClassroomController
