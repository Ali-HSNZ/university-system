import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import studyServices from './study.service'
import { Controller, Delete, Get, Post, Put } from '../../decorators/router.decorator'
import validationHandling from '../../core/utils/validation-handling/validation-handling.utils'
import studyValidation from './study.validations'
import { checkValidId } from '../../core/utils/check-valid-id'

@Controller('/study')
class StudyController {
    @Get('/list')
    async getAllStudies(req: Request, res: Response, next: NextFunction) {
        try {
            const studies = await studyServices.list()
            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: studies
            })
        } catch (error) {
            next(error)
        }
    }

    @Get('/:id/info/by-id')
    async getStudyById(req: Request, res: Response, next: NextFunction) {
        try {
            const studyId = req.params.id
            checkValidId(studyId)

            const study = await studyServices.getStudyNameById(Number(studyId))
            if (!study) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: httpStatus.NOT_FOUND,
                    message: 'داده ایی یافت نشد'
                })
            }

            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: study
            })
        } catch (error) {
            next(error)
        }
    }

    @Get('/:name/info/by-name')
    async getStudyByName(req: Request, res: Response, next: NextFunction) {
        try {
            const studyName = req.params.name
            const study = await studyServices.getByName(studyName.trim())
            if (!study) {
                throw new Error('رشته تحصیلی یافت نشد')
            }

            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: study
            })
        } catch (error) {
            next(error)
        }
    }

    @Post('/create')
    async createStudy(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await validationHandling(req.body, studyValidation)

            if (data.name) {
                const existStudy = await studyServices.getByName(data.name)
                if (existStudy.length > 0) throw new Error('این رشته تحصیلی قبلا ثبت شده است')

                const study = await studyServices.create({ name: data.name, description: data.description })
                if (!study) throw new Error('عملیات با مشکل مواجه شد')

                return res.status(httpStatus.CREATED).json({
                    status: httpStatus.CREATED,
                    message: 'رشته تحصیلی با موفقیت ایجاد شد'
                })
            }
        } catch (error) {
            next(error)
        }
    }

    @Put('/:id/update')
    async updateStudy(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id
            checkValidId(id)

            const data = await validationHandling(req.body, studyValidation)

            const study = await studyServices.checkExistIdInUpdate(id, data.name)

            if (study) {
                throw new Error('این رشته تحصیلی قبلا ثبت شده است')
            }

            const updatedStudy = await studyServices.update(id, { name: data.name, description: data.description })
            if (!updatedStudy) {
                throw new Error('عملیات با مشکل مواجه شد')
            }

            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'رشته تحصیلی با موفقیت به روز شد'
            })
        } catch (error) {
            next(error)
        }
    }

    @Delete('/:id/delete')
    async deleteStudy(req: Request, res: Response) {
        const { id } = req.params
        checkValidId(id)

        const study = await studyServices.checkExistId(id)
        if (!study) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: httpStatus.NOT_FOUND,
                message: 'رشته تحصیلی یافت نشد'
            })
        }

        const isDeleted = await studyServices.delete(id)
        if (isDeleted) {
            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'رشته تحصیلی با موفقیت حذف شد'
            })
        } else {
            res.status(httpStatus.BAD_REQUEST).json({
                status: httpStatus.BAD_REQUEST,
                message: 'عملیات با مشکل مواجه شد'
            })
        }
    }
}

export default new StudyController()
