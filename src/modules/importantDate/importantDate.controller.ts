import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'

import { Controller, Get, Post, Put } from '../../decorators/router.decorator'
import importantDateService from './importantDate.service'
import { validationHandling } from '../../core/utils/validation-handling'
import importantDateSchema from './importantDate.validation'
import departmentService from '../department/department.service'
import { checkValidId } from '../../core/utils/check-valid-id'

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
            await validationHandling(req.body, importantDateSchema)
            await importantDateService.create(req.body)

            const checkExistDepartment = await departmentService.checkExistId(req.body.department_id)
            if (!checkExistDepartment) throw new Error('گروه آموزشی مورد نظر یافت نشد')

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
}

export default ImportantDateController
