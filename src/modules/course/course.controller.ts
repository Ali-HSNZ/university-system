import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import { Controller, Delete, Get, Post, Put, UseMiddleware } from '../../decorators/router.decorator'
import courseService from './course.service'
import { validationHandling } from '../../core/utils/validation-handling'
import createCourseSchema from './course.validation'
import { checkValidId } from '../../core/utils/check-valid-id'
import departmentService from '../department/department.service'
import { serializeArray } from '../../core/middleware/serialize-array'

@Controller('/course')
class CourseController {
    @Get('/list')
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const courses = await courseService.getAll()
            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: courses
            })
        } catch (error) {
            next(error)
        }
    }

    @Get('/:id/info')
    async getInfo(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            checkValidId(id)

            const course = await courseService.getInfo(Number(id))

            if (course) {
                return res.status(httpStatus.OK).json({
                    status: httpStatus.OK,
                    message: 'عملیات با موفقیت انجام شد',
                    data: course
                })
            }

            return res.status(httpStatus.NOT_FOUND).json({
                status: httpStatus.NOT_FOUND,
                message: 'درس یافت نشد'
            })
        } catch (error) {
            next(error)
        }
    }

    @Post('/create')
    @UseMiddleware(serializeArray('prerequisites', 'corequisites'))
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            await validationHandling(req.body, createCourseSchema)

            const { name, department_id, theoretical_units, practical_units, type, prerequisites, corequisites } =
                req.body

            const existCourseName = await courseService.checkExistName(name)
            if (existCourseName) {
                return res.status(httpStatus.CONFLICT).json({
                    status: httpStatus.CONFLICT,
                    message: 'درس با این نام قبلاً ایجاد شده است.'
                })
            }

            const departmentExists = await departmentService.checkExistId(department_id)
            if (!departmentExists) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: httpStatus.BAD_REQUEST,
                    message: 'دپارتمان انتخاب شده معتبر نیست'
                })
            }

            if (Number(theoretical_units) === 0 && Number(practical_units) === 0) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: httpStatus.BAD_REQUEST,
                    message: 'واحد نظری و عملی نمی‌توانند هر دو صفر باشند.'
                })
            }

            // check exist course code
            for (const prerequisite of prerequisites) {
                const existCourseCode = await courseService.checkExistCode(prerequisite)
                if (!existCourseCode) {
                    return res.status(httpStatus.BAD_REQUEST).json({
                        status: httpStatus.BAD_REQUEST,
                        message: 'کد درس پیش‌نیاز معتبر نیست'
                    })
                }
            }

            for (const corequisite of corequisites) {
                const existCourseCode = await courseService.checkExistCode(corequisite)
                if (!existCourseCode) {
                    return res.status(httpStatus.BAD_REQUEST).json({
                        status: httpStatus.BAD_REQUEST,
                        message: 'کد درس هم‌نیاز معتبر نیست'
                    })
                }
            }

            const courseCount = await courseService.count()
            const course_code = `C${courseCount + 1}${Date.now().toString().slice(-5)}`

            const course = await courseService.create({
                ...req.body,
                code: course_code
            })

            return res.status(httpStatus.CREATED).json({
                status: httpStatus.CREATED,
                message: 'درس با موفقیت ایجاد شد.'
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

            await validationHandling(req.body, createCourseSchema)

            if (Number(req.body.theory_unit) === 0 && Number(req.body.practical_unit) === 0) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: httpStatus.BAD_REQUEST,
                    message: 'واحد نظری و عملی نمی‌تواند صفر باشد'
                })
            }

            const existCourseName = await courseService.checkExistNameInUpdate(req.body.name, id)
            if (existCourseName) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: httpStatus.BAD_REQUEST,
                    message: 'درس با این نام قبلا ایجاد شده است'
                })
            }

            const course = await courseService.update(req.body, Number(id))

            if (course) {
                return res.status(httpStatus.CREATED).json({
                    status: httpStatus.CREATED,
                    message: 'درس با موفقیت ویرایش شد',
                    data: course
                })
            }

            return res.status(httpStatus.BAD_REQUEST).json({
                status: httpStatus.BAD_REQUEST,
                message: 'فرایند ایجاد درس با خطا مواجه شد'
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

            const course = await courseService.delete(Number(id))

            if (course) {
                return res.status(httpStatus.OK).json({
                    status: httpStatus.OK,
                    message: 'درس با موفقیت حذف شد'
                })
            }

            return res.status(httpStatus.BAD_REQUEST).json({
                status: httpStatus.BAD_REQUEST,
                message: 'فرایند حذف درس با خطا مواجه شد'
            })
        } catch (error) {
            next(error)
        }
    }
}

export default new CourseController()
