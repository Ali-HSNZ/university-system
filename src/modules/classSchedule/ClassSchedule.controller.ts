import { Request, Response, NextFunction } from 'express'

import { Controller, Get, Post } from '../../decorators/router.decorator'
import classScheduleService from './ClassSchedule.service'
import httpStatus from 'http-status'
import { validationHandling } from '../../core/utils/validation-handling'
import classScheduleSchema from './ClassSchedule.validation'
import classService from '../class/class.service'
import professorService from '../professor/professor.service'

@Controller('/class-schedule')
class ClassScheduleController {
    @Get('/list')
    async get(req: Request, res: Response, next: NextFunction) {
        try {
            const classSchedule = await classScheduleService.list()
            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: classSchedule
            })
        } catch (error) {
            next(error)
        }
    }

    @Post('/create')
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            await validationHandling(req.body, classScheduleSchema)

            const checkExistClass = await classService.checkExist(req.body.class_id)
            if (!checkExistClass) throw new Error('کلاس یافت نشد')

            const checkExistProfessor = await professorService.checkExist(req.body.professor_id)
            if (!checkExistProfessor) throw new Error('استاد یافت نشد')

            const checkExistClassSchedule = await classScheduleService.checkExist(
                req.body.class_id,
                req.body.professor_id
            )
            if (checkExistClassSchedule) throw new Error('ساعت کلاس قبلاً ایجاد شده است')

            await classScheduleService.create(req.body)

            res.status(httpStatus.CREATED).json({
                status: httpStatus.CREATED,
                message: 'عملیات با موفقیت انجام شد'
            })
        } catch (error) {
            next(error)
        }
    }
}

export default new ClassScheduleController()
