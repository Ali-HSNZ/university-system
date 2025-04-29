import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import entryYearCourseService from './entry-year-course.service'
import { Controller, Get, Post, Put, Delete } from '../../decorators/router.decorator'
import { checkValidId } from '../../core/utils/check-valid-id'
import { validationHandling } from '../../core/utils/validation-handling'
import entryYearCourseValidation from './entry-year-course.validations'
import courseService from '../course/course.service'
import degreeService from '../degree/degree.service'
import departmentService from '../department/department.service'

@Controller('/entry-year-course')
class EntryYearCourseController {
    @Get('/list')
    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const entryYearCourses = await entryYearCourseService.list()
            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: entryYearCourses
            })
        } catch (error) {
            next(error)
        }
    }

    @Get('/:id')
    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id
            checkValidId(id)
            const entryYearCourse = await entryYearCourseService.getById(Number(id))
            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: entryYearCourse
            })
        } catch (error) {
            next(error)
        }
    }

    @Post('/create')
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            await entryYearCourseValidation.validate(req.body, { abortEarly: false })

            // check valid course
            const course = await courseService.checkExistId(req.body.course_id)
            if (!course) throw new Error('درس مورد نظر یافت نشد')

            // check valid degree
            const degree = await degreeService.checkExistId(req.body.degree_id)
            if (!degree) throw new Error('رشته مورد نظر یافت نشد')

            // check valid department
            const department = await departmentService.checkExistId(req.body.department_id)
            if (!department) throw new Error('گروه آموزشی مورد نظر یافت نشد')

            await entryYearCourseService.create(req.body)

            res.status(httpStatus.CREATED).json({
                status: httpStatus.CREATED,
                message: 'عملیات با موفقیت انجام شد'
            })
        } catch (error) {
            next(error)
        }
    }

    @Put('/:id')
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const entryYearCourse = await entryYearCourseService.update(Number(req.params.id), req.body)
            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: entryYearCourse
            })
        } catch (error) {
            next(error)
        }
    }

    @Delete('/:id')
    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await entryYearCourseService.delete(Number(req.params.id))
            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد'
            })
        } catch (error) {
            next(error)
        }
    }
}

export default new EntryYearCourseController()
