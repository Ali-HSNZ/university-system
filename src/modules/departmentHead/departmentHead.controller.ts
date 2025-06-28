import { Request, Response, NextFunction } from 'express'
import { Controller, Delete, Get, Put, UseMiddleware } from '../../decorators/router.decorator'
import departmentHeadService from './departmentHead.service'
import httpStatus from 'http-status'
import { TAuthenticatedRequestType } from '../../core/types/auth'
import { validationHandling } from '../../core/utils/validation-handling'
import enrollmentService from '../enrollment/enrollment.service'
import { updateEnrollmentValidation } from '../enrollment/enrollment.validation'
import {
    TUpdateDepartmentHeadFilesType,
    TUpdateDepartmentHeadInferType,
    TUpdateEnrollmentStatusInferType
} from './departmentHead.types'
import { serializeFilePath } from '../../core/utils/serialize-file-path'
import { hashString } from '../../core/utils/hash-string'
import degreeServices from '../degree/degree.service'
import departmentServices from '../department/department.service'
import userServices from '../user/user.service'
import { updateDepartmentHeadValidation, updateEducationAssistantValidation } from '../auth/auth.validation'
import { checkValidId } from '../../core/utils/check-valid-id'
import { fileUpload } from '../../core/utils/file-upload'

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

    @Get('/profile')
    async getDepartmentHeadProfile(req: TAuthenticatedRequestType, res: Response, next: NextFunction) {
        try {
            const departmentHead = await departmentHeadService.getDepartmentHeadProfile(req.user?.id!)
            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: departmentHead
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

            const existDepartmentHead = await departmentHeadService.checkExist(Number(req.params.id))
            if (!existDepartmentHead) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: httpStatus.NOT_FOUND,
                    message: 'مدیر گروه با این شناسه یافت نشد'
                })
            }

            const files = req.files as TUpdateDepartmentHeadFilesType

            // Set file paths in request body
            req.body.avatar = files?.['avatar']?.[0]
            req.body.national_card_image = files?.['national_card_image']?.[0]
            req.body.birth_certificate_image = files?.['birth_certificate_image']?.[0]
            req.body.military_service_image = files?.['military_service_image']?.[0]
            req.body.employment_contract_file = files?.['employment_contract_file']?.[0]

            const data = await validationHandling<TUpdateDepartmentHeadInferType>(
                req.body,
                updateDepartmentHeadValidation
            )

            const existUser = await userServices.checkExistInUpdate(Number(existDepartmentHead.dataValues.user_id), {
                national_code: data.national_code,
                phone: data?.phone || null,
                email: data?.email || null
            })
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

            const user = await userServices.update(Number(existDepartmentHead.dataValues.user_id), {
                first_name: data.first_name,
                last_name: data.last_name,
                national_code: data.national_code,
                gender: data.gender,
                birth_date: data.birth_date,
                phone: data.phone || undefined,
                email: data.email || undefined,
                address: data.address || undefined,
                avatar: images?.avatar,
                role: 'department_head',
                password: (hashedPassword || undefined) as string
            })

            if (!user) throw new Error('بروزرسانی با مشکل مواجه شد')

            const departmentHead = await departmentHeadService.update(Number(req.params.id), {
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

            if (!departmentHead) throw new Error('بروزرسانی اطلاعات با مشکل مواجه شد')

            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'اطلاعات با موفقیت بروزرسانی شد'
            })
        } catch (error) {
            next(error)
        }
    }
    @Delete('/:id/delete')
    async deleteDepartmentHead(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidId(req.params.id)

            const existDepartmentHead = await departmentHeadService.checkExist(Number(req.params.id))
            if (!existDepartmentHead) throw new Error('مدیر گروه با این شناسه یافت نشد')

            await departmentHeadService.delete(Number(req.params.id))

            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد'
            })
        } catch (error) {
            next(error)
        }
    }

    @Get('/:id/info')
    async findOne(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidId(req.params.id)
            const departmentHead = await departmentHeadService.getDetailById(Number(req.params.id))

            if (!departmentHead) throw new Error('مدیر گروه با این اطلاعات یافت نشد')

            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: departmentHead
            })
        } catch (error) {
            next(error)
        }
    }
}

export default DepartmentHeadController
