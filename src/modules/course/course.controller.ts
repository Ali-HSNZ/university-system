import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import { Controller, Delete, Get, Post, Put } from '../../decorators/router.decorator'
import courseService from './course.service'
import { validationHandling } from '../../core/utils/validation-handling'
import createCourseSchema from './course.validation'
import { checkValidId } from '../../core/utils/check-valid-id'

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
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            await validationHandling(req.body, createCourseSchema)

            // create unique digits code
            const courseCount = await courseService.count()

            const course_code = `${courseCount + 1}${Math.floor(100000 + Math.random() * 900000)}`

            if (Number(req.body.theory_unit) === 0 && Number(req.body.practical_unit) === 0) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: httpStatus.BAD_REQUEST,
                    message: 'واحد نظری و عملی نمیتواند صفر باشد'
                })
            }

            const existCourseName = await courseService.checkExistName(req.body.name)
            if (existCourseName) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: httpStatus.BAD_REQUEST,
                    message: 'درس با این نام قبلا ایجاد شده است'
                })
            }

            const course = await courseService.create({
                ...req.body,
                code: course_code
            })

            if (course) {
                return res.status(httpStatus.CREATED).json({
                    status: httpStatus.CREATED,
                    message: 'درس با موفقیت ایجاد شد',
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
