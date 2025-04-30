import { Request, Response, NextFunction } from 'express'

import { Controller, Get, Post } from '../../decorators/router.decorator'
import classScheduleService from './ClassSchedule.service'
import httpStatus from 'http-status'
import { validationHandling } from '../../core/utils/validation-handling'
import classScheduleSchema from './ClassSchedule.validation'
import classService from '../class/class.service'
import professorService from '../professor/professor.service'
import TClassScheduleInferType from './ClassSchedule.types'
import classroomService from '../classroom/classroom.service'

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
            const data = await validationHandling<TClassScheduleInferType>(req.body, classScheduleSchema)

            const checkExistClass = await classService.checkExist(data.class_id)
            if (!checkExistClass) throw new Error('کلاس یافت نشد')

            const checkExistClassroom = await classroomService.checkExist(data.classroom_id)
            if (!checkExistClassroom) throw new Error('سالن یافت نشد')

            const checkExistProfessor = await professorService.checkExist(data.professor_id)
            if (!checkExistProfessor) throw new Error('استاد یافت نشد')

            const checkExistClassSchedule = await classScheduleService.checkExist(data.class_id, data.professor_id)
            if (checkExistClassSchedule) throw new Error('کلاس قبلاً ایجاد شده است')

            await classScheduleService.create(data)

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
