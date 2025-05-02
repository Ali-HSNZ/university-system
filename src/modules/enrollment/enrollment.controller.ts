import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import { Controller, Delete, Get, Post, Put } from '../../decorators/router.decorator'
import { validationHandling } from '../../core/utils/validation-handling'
import { checkValidId } from '../../core/utils/check-valid-id'
import enrollmentService from './enrollment.service'
import { createEnrollmentValidation, updateEnrollmentValidation, classIdValidation } from './enrollment.validation'
import studentService from '../student/student.service'
import { TAuthenticatedRequestType } from '../../core/types/auth'

@Controller('/enrollment')
class EnrollmentController {
    @Get('/list')
    async getEnrollments(req: Request, res: Response, next: NextFunction) {
        try {
            const enrollments = await enrollmentService.list()

            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: enrollments
            })
        } catch (error) {
            next(error)
        }
    }
    @Get('/:id')
    async getEnrollment(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            checkValidId(id)

            const enrollment = await enrollmentService.getEnrollmentById(Number(id))

            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: enrollment
            })
        } catch (error) {
            next(error)
        }
    }

    @Get('/class/:classId')
    async getClassEnrollments(req: Request, res: Response, next: NextFunction) {
        try {
            const { classId } = req.params
            checkValidId(classId)

            await validationHandling({ classId: Number(classId) }, classIdValidation)

            const enrollments = await enrollmentService.getClassEnrollments(Number(classId))

            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'Class enrollments retrieved successfully',
                data: enrollments
            })
        } catch (error) {
            next(error)
        }
    }

    @Get('/student/:userId')
    async getStudentEnrollments(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params
            checkValidId(userId)

            const student = await studentService.getByUserId(Number(userId))
            if (!student) throw new Error('دانشجویی با این شناسه یافت نشد')

            const enrollments = await enrollmentService.getStudentEnrollments(Number(student.dataValues.id))

            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: enrollments
            })
        } catch (error) {
            next(error)
        }
    }

    @Post('/create')
    async createEnrollment(req: TAuthenticatedRequestType, res: Response, next: NextFunction) {
        try {
            await validationHandling(req.body, createEnrollmentValidation)

            const student = await studentService.getByUserId(req.user?.id)
            if (!student) throw new Error('دانشجویی با این شناسه یافت نشد')

            const handleEnrollmentTimeStatus = await enrollmentService.handleImportantTimeStatus({
                entry_year: student.dataValues.entry_year,
                department_id: student.dataValues.department_id,
                degree_id: student.dataValues.degree_id,
                study_id: student.dataValues.study_id
            })

            if (!handleEnrollmentTimeStatus.status) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: httpStatus.BAD_REQUEST,
                    message: handleEnrollmentTimeStatus.message
                })
            }

            await enrollmentService.createEnrollment(req.body)

            return res.status(httpStatus.CREATED).json({
                status: httpStatus.CREATED,
                message: 'عملیات با موفقیت انجام شد'
            })
        } catch (error) {
            next(error)
        }
    }

    @Put('/:id/update')
    async updateEnrollment(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            checkValidId(id)

            await validationHandling(req.body, updateEnrollmentValidation)

            const enrollment = await enrollmentService.updateEnrollmentStatus(Number(id), req.body)

            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'Enrollment updated successfully',
                data: enrollment
            })
        } catch (error) {
            next(error)
        }
    }

    @Delete('/:id/delete')
    async deleteEnrollment(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            checkValidId(id)

            await enrollmentService.deleteEnrollment(Number(id))

            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد'
            })
        } catch (error) {
            next(error)
        }
    }
}

export default new EnrollmentController()
