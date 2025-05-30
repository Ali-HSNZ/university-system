import { Request, Response, NextFunction } from 'express'
import { Controller, Get, Put } from '../../decorators/router.decorator'
import departmentHeadService from './departmentHead.service'
import httpStatus from 'http-status'
import { TAuthenticatedRequestType } from '../../core/types/auth'
import { validationHandling } from '../../core/utils/validation-handling'
import enrollmentService from '../enrollment/enrollment.service'
import { updateEnrollmentValidation } from '../enrollment/enrollment.validation'
import { TUpdateEnrollmentStatusInferType } from './departmentHead.types'

@Controller('/department-head')
class DepartmentHeadController {
    @Get('/list')
    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const departmentHeads = await departmentHeadService.list()
            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: departmentHeads
            })
        } catch (error) {
            next(error)
        }
    }

    @Get('/enrollments')
    async getDepartmentEnrollments(req: TAuthenticatedRequestType, res: Response, next: NextFunction) {
        try {
            if (!req.user?.id) {
                throw new Error('User ID is required')
            }

            const enrollments = await departmentHeadService.getDepartmentEnrollments(req.user.id)
            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: enrollments
            })
        } catch (error) {
            next(error)
        }
    }

    @Put('/enrollment/update')
    async updateEnrollmentStatus(req: TAuthenticatedRequestType, res: Response, next: NextFunction) {
        try {
            if (!req.user?.id) {
                throw new Error('User ID is required')
            }

            const data = await validationHandling<TUpdateEnrollmentStatusInferType>(
                req.body,
                updateEnrollmentValidation
            )

            for (const item of data.data) {
                await enrollmentService.updateEnrollmentStatus({
                    id: item.id,
                    updateData: {
                        user_role: 'department_head',
                        comment: item.comment || '',
                        status: item.status
                    },
                    userId: req.user.id
                })
            }

            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'وضعیت ثبت نام با موفقیت بروزرسانی شد'
            })
        } catch (error) {
            next(error)
        }
    }
}

export default DepartmentHeadController
