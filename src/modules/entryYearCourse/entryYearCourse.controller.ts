import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import entryYearCourseService from './entryYearCourse.service'
import { Controller, Get, Post, Put, Delete } from '../../decorators/router.decorator'
import { checkValidId } from '../../core/utils/check-valid-id'
import entryYearCourseValidation from './entryYearCourse.validations'
import { TEntryYearCourseBodyInferType } from './entryYearCourse.types'
import { validationHandling } from '../../core/utils/validation-handling'
import entryYearService from '../entryYear/entryYear.service'
import courseService from '../course/course.service'

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
            const data = await validationHandling<TEntryYearCourseBodyInferType>(req.body, entryYearCourseValidation)

            // check valid degree
            const course = await courseService.checkExistId(req.body.course_id)
            if (!course) throw new Error('درس مورد نظر یافت نشد')

            // check valid department
            const entryYear = await entryYearService.getById(req.body.entry_year_id)
            if (!entryYear) throw new Error('سال ورود مورد نظر یافت نشد')

            const existEntryYearCourse = await entryYearCourseService.checkExistEntryYearCourse(
                req.body.entry_year_id,
                req.body.course_id
            )
            if (existEntryYearCourse) throw new Error('درس مورد نظر قبلاً ایجاد شده است')

            await entryYearCourseService.create(data)

            res.status(httpStatus.CREATED).json({
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
            await entryYearCourseService.update(Number(req.params.id), req.body)
            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد'
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
