import { Request, Response, NextFunction } from 'express'
import { Controller, Delete, Get, Post, Put } from '../../decorators/router.decorator'
import semesterService from './semester.service'
import httpStatus from 'http-status'
import { validationHandling } from '../../core/utils/validation-handling'
import semesterSchema from './semester.validation'
import { checkValidId } from '../../core/utils/check-valid-id'

@Controller('/semester')
class SemesterController {
    @Get('/list')
    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const semesters = await semesterService.list()
            
            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: semesters
            })
        } catch (error) {
            next(error)
        }
    }

    @Get('/:id/info')
    async info(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            checkValidId(id)

            const semester = await semesterService.info(Number(id))

            if (!semester) {
                throw new Error('ترمی یافت نشد')
            }

            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: semester
            })
        } catch (error) {
            next(error)
        }
    }

    @Post('/create')
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            await validationHandling(req.body, semesterSchema)

            const checkAcademicYear = await semesterService.checkAcademicYear(
                req.body.term_number,
                req.body.academic_year
            )

            if (checkAcademicYear) {
                throw new Error('سال تحصیلی قبلا ایجاد شده است')
            }

            await semesterService.create(req.body)

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

            await validationHandling(req.body, semesterSchema)

            const checkAcademicYear = await semesterService.checkAcademicYearInUpdate(
                Number(id),
                req.body.term_number,
                req.body.academic_year
            )

            if (checkAcademicYear) {
                throw new Error('سال تحصیلی قبلا ایجاد شده است')
            }

            await semesterService.update(Number(id), req.body)

            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'ویرایش با موفقیت انجام شد'
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

            const existSemester = await semesterService.checkExist(Number(id))

            if (!existSemester) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: httpStatus.NOT_FOUND,
                    message: 'ترم یافت نشد'
                })
            }

            await semesterService.delete(Number(id))
            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد'
            })
        } catch (error) {
            next(error)
        }
    }
}

export default SemesterController
