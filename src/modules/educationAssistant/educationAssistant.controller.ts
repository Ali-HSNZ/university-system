import { Request, Response, NextFunction } from 'express'
import { Controller, Delete, Get, Put } from '../../decorators/router.decorator'
import educationAssistantService from './educationAssistant.service'
import httpStatus from 'http-status'
import { TAuthenticatedRequestType } from '../../core/types/auth'
import { validationHandling } from '../../core/utils/validation-handling'
import { updateEnrollmentValidation } from './educationAssistant.validation'
import {
    TUpdateEducationAssistantFilesType,
    TUpdateEducationAssistantInferType,
    TUpdateEnrollmentStatusInferType
} from './educationAssistant.types'
import { checkValidId } from '../../core/utils/check-valid-id'
import userServices from '../user/user.service'
import { serializeFilePath } from '../../core/utils/serialize-file-path'
import { hashString } from '../../core/utils/hash-string'
import degreeServices from '../degree/degree.service'
import departmentServices from '../department/department.service'
import { updateEducationAssistantValidation } from '../auth/auth.validation'
import { UseMiddleware } from '../../decorators/router.decorator'
import { fileUpload } from '../../core/utils/file-upload'

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

    @Get('/:id/info')
    async findOne(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidId(req.params.id)
            const educationAssistant = await educationAssistantService.getDetailById(Number(req.params.id))

            if (!educationAssistant) throw new Error('معاون آموزشی با این اطلاعات یافت نشد')

            res.status(httpStatus.OK).json({
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

    @Put('/:id/update')
    @UseMiddleware(
        fileUpload.fields([
            { name: 'avatar', maxCount: 1 },
            { name: 'national_card_image', maxCount: 1 },
            { name: 'birth_certificate_image', maxCount: 1 },
            { name: 'military_service_image', maxCount: 1 },
            { name: 'employment_contract_file', maxCount: 1 }
        ])
    )
    async updateEducationAssistant(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidId(req.params.id)

            const existEducationAssistant = await educationAssistantService.checkExist(Number(req.params.id))
            if (!existEducationAssistant) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: httpStatus.NOT_FOUND,
                    message: 'معاون آموزشی با این شناسه یافت نشد'
                })
            }

            const files = req.files as TUpdateEducationAssistantFilesType

            // Set file paths in request body
            req.body.avatar = files?.['avatar']?.[0]
            req.body.national_card_image = files?.['national_card_image']?.[0]
            req.body.birth_certificate_image = files?.['birth_certificate_image']?.[0]
            req.body.military_service_image = files?.['military_service_image']?.[0]
            req.body.employment_contract_file = files?.['employment_contract_file']?.[0]

            const data = await validationHandling<TUpdateEducationAssistantInferType>(
                req.body,
                updateEducationAssistantValidation
            )

            const existUser = await userServices.checkExistInUpdate(
                Number(existEducationAssistant.dataValues.user_id),
                {
                    national_code: data.national_code,
                    phone: data?.phone || null,
                    email: data?.email || null
                }
            )
            if (existUser) {
                return res.status(422).json({
                    code: 422,
                    message: 'اطلاعات وارد شده معتبر نیست',
                    errors: existUser
                })
            }

            const existDepartment = await departmentServices.checkExist(Number(data.department_id))
            if (!existDepartment) throw new Error('گروه آموزشی موجود نمی باشد')

            const existDegree = await degreeServices.checkExist(data.degree_id)
            if (!existDegree) throw new Error('مقطع تحصیلی موجود نمی باشد')

            const hashedPassword = data.password ? hashString(data.password) : undefined

            const images = {
                avatar: serializeFilePath(req.body.avatar?.path),
                national_card_image: serializeFilePath(req.body.national_card_image?.path),
                birth_certificate_image: serializeFilePath(req.body.birth_certificate_image?.path),
                military_service_image: serializeFilePath(req.body.military_service_image?.path),
                employment_contract_file: serializeFilePath(req.body.employment_contract_file?.path)
            }

            const user = await userServices.update(Number(existEducationAssistant.dataValues.user_id), {
                first_name: data.first_name,
                last_name: data.last_name,
                national_code: data.national_code,
                gender: data.gender,
                birth_date: data.birth_date,
                phone: data.phone || undefined,
                email: data.email || undefined,
                address: data.address || undefined,
                avatar: images?.avatar,
                role: 'education_assistant',
                password: (hashedPassword || undefined) as string
            })

            if (!user) throw new Error('بروزرسانی با مشکل مواجه شد')

            const educationAssistant = await educationAssistantService.update(Number(req.params.id), {
                department_id: data.department_id,
                study_id: data.study_id,
                work_experience_years: data.work_experience_years,
                office_phone: data.office_phone,
                office_address: data.office_address,
                hire_date: data.hire_date,
                responsibilities: data.responsibilities,
                degree_id: data.degree_id,
                education_assistant_code: data.education_assistant_code,
                status: data.status,
                national_card_image: images?.national_card_image,
                birth_certificate_image: images?.birth_certificate_image,
                military_service_image: images?.military_service_image,
                employment_contract_file: images?.employment_contract_file
            })

            if (!educationAssistant) throw new Error('بروزرسانی اطلاعات با مشکل مواجه شد')

            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'اطلاعات با موفقیت بروزرسانی شد'
            })
        } catch (error) {
            next(error)
        }
    }

    @Delete('/:id/delete')
    async deleteEducationAssistant(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidId(req.params.id)

            const existEducationAssistant = await educationAssistantService.checkExist(Number(req.params.id))
            if (!existEducationAssistant) throw new Error('معاون آموزشی با این شناسه یافت نشد')

            await educationAssistantService.delete(Number(req.params.id))

            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد'
            })
        } catch (error) {
            next(error)
        }
    }
}

export default EducationAssistantController
