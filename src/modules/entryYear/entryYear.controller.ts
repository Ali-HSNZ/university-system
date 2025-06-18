import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import entryYearService from './entryYear.service'
import { Controller, Get, Post, Put, Delete } from '../../decorators/router.decorator'
import { checkValidId } from '../../core/utils/check-valid-id'
import entryYearValidation from './entryYear.validations'
import degreeService from '../degree/degree.service'
import departmentService from '../department/department.service'
import TEntryYearBodyInferType from './entryYear.types'
import { validationHandling } from '../../core/utils/validation-handling'
import studyServices from '../study/study.service'

@Controller('/entry-year')
class EntryYearController {
    @Get('/list')
    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const entryYears = await entryYearService.list()
            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: entryYears
            })
        } catch (error) {
            next(error)
        }
    }

    @Get('/:id/info')
    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id
            checkValidId(id)
            const entryYear = await entryYearService.getById(Number(id))
            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: entryYear
            })
        } catch (error) {
            next(error)
        }
    }

    @Post('/create')
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await validationHandling<TEntryYearBodyInferType>(req.body, entryYearValidation)

            // check valid degree
            const degree = await degreeService.checkExistId(Number(data.degree_id))
            if (!degree) throw new Error('رشته مورد نظر یافت نشد')

            // check valid department
            const department = await departmentService.checkExistId(Number(data.department_id))
            if (!department) throw new Error('گروه آموزشی مورد نظر یافت نشد')

            // check valid department
            const study = await studyServices.checkExistId(Number(data.study_id))
            if (!study) throw new Error('رشته تحصیلی مورد نظر یافت نشد')

            const checkExistEntryYear = await entryYearService.checkExistEntryYearInAdd({
                year: Number(data.year),
                degree_id: Number(data.degree_id),
                department_id: Number(data.department_id),
                study_id: Number(data.study_id)
            })
            if (checkExistEntryYear) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: httpStatus.BAD_REQUEST,
                    message: 'سال ورودی مورد نظر قبلاً ایجاد شده است'
                })
            }

            await entryYearService.create(data)

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
            const { id } = req.params
            checkValidId(id)

            const data = await validationHandling<TEntryYearBodyInferType>(req.body, entryYearValidation)

            // check valid degree
            const degree = await degreeService.checkExistId(Number(data.degree_id))
            if (!degree) throw new Error('رشته مورد نظر یافت نشد')

            // check valid department
            const department = await departmentService.checkExistId(Number(data.department_id))
            if (!department) throw new Error('گروه آموزشی مورد نظر یافت نشد')

            // check valid department
            const study = await studyServices.checkExistId(Number(data.study_id))
            if (!study) throw new Error('رشته تحصیلی مورد نظر یافت نشد')

            const checkExistEntryYear = await entryYearService.checkExistEntryYearInUpdate(Number(id), {
                year: Number(data.year),
                degree_id: Number(data.degree_id),
                department_id: Number(data.department_id),
                study_id: Number(data.study_id)
            })

            if (checkExistEntryYear) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: httpStatus.BAD_REQUEST,
                    message: 'سال ورودی مورد نظر قبلاً ایجاد شده است'
                })
            }

            await entryYearService.update(Number(req.params.id), req.body)

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
            await entryYearService.delete(Number(req.params.id))
            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد'
            })
        } catch (error) {
            next(error)
        }
    }
}

export default new EntryYearController()
