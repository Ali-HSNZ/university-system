import { Request, Response, NextFunction } from 'express'
import { Controller, Get, Put } from '../../decorators/router.decorator'
import educationAssistantService from './educationAssistant.service'
import httpStatus from 'http-status'
import { TAuthenticatedRequestType } from '../../core/types/auth'
import { validationHandling } from '../../core/utils/validation-handling'
import { updateEnrollmentValidation } from './educationAssistant.validation'
import { TUpdateEnrollmentStatusInferType } from './educationAssistant.types'

@Controller('/education-assistant')
class EducationAssistantController {
    @Get('/list')
    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const educationAssistants = await educationAssistantService.list()
            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: educationAssistants
            })
        } catch (error) {
            next(error)
        }
    }
    @Get('/profile')
    async profile(req: TAuthenticatedRequestType, res: Response, next: NextFunction) {
        try {
            if (!req.user?.id) {
                throw new Error('User ID is required')
            }

            const educationAssistant = await educationAssistantService.profile(req.user.id)

            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: educationAssistant
            })
        } catch (error) {
            next(error)
        }
    }

    @Get('/enrollments')
    async getEnrollments(req: TAuthenticatedRequestType, res: Response, next: NextFunction) {
        try {
            if (!req.user?.id) {
                throw new Error('User ID is required')
            }

            const enrollments = await educationAssistantService.getEnrollments(req.user.id)
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
                await educationAssistantService.updateEnrollmentStatus({
                    id: item.id,
                    updateData: {
                        user_role: 'education_assistant',
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

export default EducationAssistantController
