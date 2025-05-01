import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'

import { Controller, Delete, Get, Post, Put } from '../../decorators/router.decorator'
import importantDateService from './importantDate.service'
import { validationHandling } from '../../core/utils/validation-handling'
import importantDateSchema from './importantDate.validation'
import departmentService from '../department/department.service'
import { checkValidId } from '../../core/utils/check-valid-id'
import degreeServices from '../degree/degree.service'
import studyService from '../study/study.service'
import TImportantDateInferType from './importantDate.types'

@Controller('/important-date')
class ImportantDateController {
    @Get('/list')
    async getImportantDates(req: Request, res: Response, next: NextFunction) {
        try {
            const importantDates = await importantDateService.list()
            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: importantDates
            })
        } catch (error) {
            next(error)
        }
    }

    @Get('/:id/info')
    async getImportantDateById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            checkValidId(id)

            const checkExistImportantDate = await importantDateService.checkExistId(Number(id))
            if (!checkExistImportantDate) throw new Error('اطلاع رسانی مورد نظر یافت نشد')

            const importantDate = await importantDateService.info(Number(id))
            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: importantDate
            })
        } catch (error) {
            next(error)
        }
    }

    @Post('/create')
    async createImportantDate(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await validationHandling<TImportantDateInferType>(req.body, importantDateSchema)

            const checkExistImportantDate = await importantDateService.checkExist(data)
            if (checkExistImportantDate) throw new Error('اطلاع رسانی مورد نظر قبلا ایجاد شده است')

            const checkExistDepartment = await departmentService.checkExistId(req.body.department_id)
            if (!checkExistDepartment) throw new Error('گروه آموزشی مورد نظر یافت نشد')

            const checkExistDegree = await degreeServices.checkExistId(req.body.degree_id)
            if (!checkExistDegree) throw new Error('مقطع تحصیلی مورد نظر یافت نشد')

            const checkExistStudy = await studyService.checkExistId(req.body.study_id)
            if (!checkExistStudy) throw new Error('رشته تحصیلی مورد نظر یافت نشد')

            await importantDateService.create(req.body)

            return res.status(httpStatus.CREATED).json({
                status: httpStatus.CREATED,
                message: 'عملیات با موفقیت انجام شد'
            })
        } catch (error) {
            next(error)
        }
    }

    @Put('/:id/update')
    async updateImportantDate(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            checkValidId(id)

            await validationHandling(req.body, importantDateSchema)

            const checkExistImportantDate = await importantDateService.checkExistId(Number(id))
            if (!checkExistImportantDate) throw new Error('اطلاع رسانی مورد نظر یافت نشد')

            await importantDateService.update(Number(id), req.body)

            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد'
            })
        } catch (error) {
            next(error)
        }
    }

    @Delete('/:id/delete')
    async deleteImportantDate(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            checkValidId(id)

            const checkExistImportantDate = await importantDateService.checkExistId(Number(id))
            if (!checkExistImportantDate) throw new Error('اطلاع رسانی مورد نظر یافت نشد')

            await importantDateService.delete(Number(id))

            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد'
            })
        } catch (error) {
            next(error)
        }
    }
}

export default ImportantDateController
