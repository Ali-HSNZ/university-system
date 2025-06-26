import { Request, Response, NextFunction } from 'express'

import { Controller, Delete, Get, Post, Put } from '../../decorators/router.decorator'
import classScheduleService from './ClassSchedule.service'
import httpStatus from 'http-status'
import { validationHandling } from '../../core/utils/validation-handling'
import classScheduleSchema, { classScheduleUpdateSchema } from './ClassSchedule.validation'
import classService from '../class/class.service'
import professorService from '../professor/professor.service'
import { TClassScheduleInferType, TClassScheduleUpdateInferType } from './ClassSchedule.types'
import classroomService from '../classroom/classroom.service'
import { checkValidId } from '../../core/utils/check-valid-id'
import semesterService from '../semester/semester.service'

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

    @Get('/:semester_id/group-by-class')
    async groupByClassBySemester(req: Request, res: Response, next: NextFunction) {
        try {
            const { semester_id } = req.params
            checkValidId(semester_id)

            const classSchedule = await classScheduleService.groupByClass(semester_id)

            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: classSchedule
            })
        } catch (error) {
            next(error)
        }
    }

    @Get('/group-by-class')
    async groupByClassBy(req: Request, res: Response, next: NextFunction) {
        try {
            const classSchedule = await classScheduleService.groupByClass()

            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: classSchedule
            })
        } catch (error) {
            next(error)
        }
    }

    @Get('/check-exist')
    async checkExist(req: Request, res: Response, next: NextFunction) {
        try {
            const { course_name, professor_id, class_id, day_of_week } = req.query

            if (!course_name || !professor_id || !class_id || !day_of_week) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: httpStatus.BAD_REQUEST,
                    message: 'پارامترهای course_name، professor_id، class_id و day_of_week الزامی هستند'
                })
            }

            const exists = await classScheduleService.checkExistByCourseProfessorClassDay(
                course_name as string,
                professor_id as string,
                class_id as string,
                day_of_week as string
            )

            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: {
                    exists,
                    message: exists
                        ? 'کلاس در این روز با این استاد وجود دارد'
                        : 'کلاس در این روز با این استاد وجود ندارد'
                }
            })
        } catch (error) {
            next(error)
        }
    }

    @Get('/check-professor-class-day')
    async checkProfessorClassDay(req: Request, res: Response, next: NextFunction) {
        try {
            const { professor_id, class_id, day_of_week } = req.query

            if (!professor_id || !class_id || !day_of_week) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: httpStatus.BAD_REQUEST,
                    message: 'پارامترهای professor_id، class_id و day_of_week الزامی هستند'
                })
            }

            const exists = await classScheduleService.checkExistByProfessorClassDay(
                professor_id as string,
                class_id as string,
                day_of_week as string
            )

            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: {
                    exists,
                    message: exists
                        ? 'این استاد قبلاً در این روز برای این کلاس برنامه‌ریزی شده است'
                        : 'این استاد در این روز برای این کلاس برنامه‌ریزی نشده است'
                }
            })
        } catch (error) {
            next(error)
        }
    }

    @Get('/check-professor-schedule')
    async checkProfessorSchedule(req: Request, res: Response, next: NextFunction) {
        try {
            const { professor_id, start_time, end_time, day_of_week } = req.query

            if (!professor_id || !start_time || !end_time) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: httpStatus.BAD_REQUEST,
                    message: 'پارامترهای professor_id، start_time و end_time الزامی هستند'
                })
            }

            // Check conflicts for specific day if provided
            let conflicts: any[] = []
            let availableDays: string[] = []

            if (day_of_week) {
                conflicts = await classScheduleService.checkProfessorTimeConflicts(
                    professor_id as string,
                    day_of_week as string,
                    start_time as string,
                    end_time as string
                )
            }

            // Get available days
            availableDays = await classScheduleService.checkProfessorAvailableDays(
                professor_id as string,
                start_time as string,
                end_time as string
            )

            const conflictDetails = conflicts.map((conflict: any) => ({
                course_name: conflict.class?.course?.name || 'نامشخص',
                start_time: conflict.start_time,
                end_time: conflict.end_time,
                day_of_week: conflict.day_of_week,
                classroom: conflict.classroom?.name || 'نامشخص'
            }))

            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: {
                    hasConflicts: conflicts.length > 0,
                    conflicts: conflictDetails,
                    availableDays,
                    dayNames: {
                        '0': 'شنبه',
                        '1': 'یکشنبه',
                        '2': 'دوشنبه',
                        '3': 'سه‌شنبه',
                        '4': 'چهارشنبه',
                        '5': 'پنج‌شنبه',
                        '6': 'جمعه'
                    }
                }
            })
        } catch (error) {
            next(error)
        }
    }

    @Get('/test-conflicts')
    async testConflicts(req: Request, res: Response, next: NextFunction) {
        try {
            const testResults = await classScheduleService.testConflictChecking()

            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'تست بررسی تداخل‌ها انجام شد',
                data: testResults
            })
        } catch (error) {
            next(error)
        }
    }

    @Get('/test-create')
    async testCreate(req: Request, res: Response, next: NextFunction) {
        try {
            const testResults = await classScheduleService.testCreateWithConflicts()

            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'تست ایجاد کلاس انجام شد',
                data: testResults
            })
        } catch (error) {
            next(error)
        }
    }

    @Get('/test-same-professor-class')
    async testSameProfessorClass(req: Request, res: Response, next: NextFunction) {
        try {
            // Test creating same professor-class combination
            const testData = {
                classroom_id: '2', // Different classroom
                professor_id: '1',
                class_id: '1',
                day_of_week: '2', // Different day
                start_time: '14:00', // Different time
                end_time: '16:00',
                semester_id: 1
            }

            try {
                const result = await classScheduleService.create(testData)
                res.status(httpStatus.OK).json({
                    status: httpStatus.OK,
                    message: 'تست موفق: کلاس با استاد تکراری ایجاد شد',
                    data: { success: true, result }
                })
            } catch (error) {
                res.status(httpStatus.OK).json({
                    status: httpStatus.OK,
                    message: 'تست: خطا در ایجاد کلاس',
                    data: { success: false, error: (error as Error).message }
                })
            }
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

            const activeSemester = await semesterService.getActiveSemester()
            if (!activeSemester) throw new Error('ترم فعال یافت نشد')

            await classScheduleService.create({ ...data, semester_id: activeSemester.dataValues.id })

            res.status(httpStatus.CREATED).json({
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

            const checkExistClassSchedule = await classScheduleService.checkExistById(id)
            if (!checkExistClassSchedule) throw new Error('ساعات کلاس یافت نشد')

            await classScheduleService.delete(id)

            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد'
            })
        } catch (error) {
            next(error)
        }
    }

    @Put('/:id/update')
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            checkValidId(id)

            const data = await validationHandling<TClassScheduleUpdateInferType>(req.body, classScheduleUpdateSchema)

            const checkExistClassSchedule = await classScheduleService.checkExistById(id)
            if (!checkExistClassSchedule) throw new Error('ساعات کلاس یافت نشد')

            // Validate class_id if provided
            if (data.class_id) {
                const checkExistClass = await classService.checkExist(data.class_id)
                if (!checkExistClass) throw new Error('کلاس یافت نشد')
            }

            // Validate classroom_id if provided
            if (data.classroom_id) {
                const checkExistClassroom = await classroomService.checkExist(data.classroom_id)
                if (!checkExistClassroom) throw new Error('سالن یافت نشد')
            }

            // Validate professor_id if provided
            if (data.professor_id) {
                const checkExistProfessor = await professorService.checkExist(data.professor_id)
                if (!checkExistProfessor) throw new Error('استاد یافت نشد')
            }

            await classScheduleService.update(id, data)

            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد'
            })
        } catch (error) {
            next(error)
        }
    }
}

export default new ClassScheduleController()

