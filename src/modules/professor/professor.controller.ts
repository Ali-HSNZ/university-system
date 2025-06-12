import { NextFunction, Request, Response } from 'express'
import { Controller, Delete, Get, UseMiddleware, Put } from '../../decorators/router.decorator'
import professorService from './professor.service'
import httpStatus from 'http-status'
import { checkValidId } from '../../core/utils/check-valid-id'
import { fileUpload } from '../../core/utils/file-upload'
import { serializeArray } from '../../core/middleware/serialize-array'
import { TRegisterProfessorFilesType, TUpdateProfessorInferType } from '../auth/auth.types'
import { validationHandling } from '../../core/utils/validation-handling'
import departmentServices from '../department/department.service'
import { serializeFilePath } from '../../core/utils/serialize-file-path'
import userServices from '../user/user.service'
import { updateProfessorValidation } from '../auth/auth.validation'
import { hashString } from '../../core/utils/hash-string'
import authServices from '../auth/auth.service'
import degreeServices from '../degree/degree.service'

@Controller('/professor')
class ProfessorController {
    @Get('/list')
    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const professors = await professorService.list()

            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: professors
            })
        } catch (error) {
            next(error)
        }
    }

    @Get('/:id/info')
    async detail(req: Request, res: Response, next: NextFunction) {
        try {
            const professorId = req.params.id
            checkValidId(professorId)

            const existProfessor = await professorService.checkExist(Number(professorId))
            if (!existProfessor) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: httpStatus.NOT_FOUND,
                    message: 'استادی با این شناسه یافت نشد'
                })
            }

            const professor = await professorService.info(Number(professorId))

            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: professor
            })
        } catch (error) {
            next(error)
        }
    }

    @Put('/:id/update')
    @UseMiddleware(
        fileUpload.fields([
            { name: 'avatar', maxCount: 1 },
            { name: 'national_card_file', maxCount: 1 },
            { name: 'birth_certificate_file', maxCount: 1 },
            { name: 'military_service_file', maxCount: 1 },
            { name: 'cv_file', maxCount: 1 },
            { name: 'phd_certificate_file', maxCount: 1 },
            { name: 'employment_contract_file', maxCount: 1 }
        ])
    )
    async updateProfessor(req: Request, res: Response, next: NextFunction) {
        try {
            const professorId = req.params.id
            checkValidId(professorId)

            const existProfessor = await professorService.checkExist(Number(professorId))
            if (!existProfessor) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: httpStatus.NOT_FOUND,
                    message: 'استادی با این شناسه یافت نشد'
                })
            }

            const files = req.files as TRegisterProfessorFilesType

            req.body.avatar = files?.['avatar']?.[0]
            req.body.cv_file = files?.['cv_file']?.[0]
            req.body.national_card_file = files?.['national_card_file']?.[0]
            req.body.birth_certificate_file = files?.['birth_certificate_file']?.[0]
            req.body.military_service_file = files?.['military_service_file']?.[0]
            req.body.phd_certificate_file = files?.['phd_certificate_file']?.[0]
            req.body.employment_contract_file = files?.['employment_contract_file']?.[0]

            const data = await validationHandling<TUpdateProfessorInferType>(req.body, updateProfessorValidation)
            console.log('status: ', (data as any).status)

            const existUser = await userServices.checkExistInUpdate(Number(existProfessor.dataValues.user_id), {
                national_code: data.national_code,
                phone: data?.phone || null,
                email: data?.email || null
            })

            if (existUser) throw new Error('کاربر در سیستم وجود دارد')

            const existDepartment = await departmentServices.checkExist(Number(data.department_id))
            if (!existDepartment) throw new Error('گروه آموزشی موجود نمی باشد')

            const existDegree = await degreeServices.checkExist(data.degree_id)
            if (!existDegree) throw new Error('مقطع تحصیلی موجود نمی باشد')

            const hashedPassword = data.password ? hashString(data.password) : undefined

            const images = {
                avatar: serializeFilePath(req.body.avatar?.path),
                national_card_file: serializeFilePath(req.body.national_card_file?.path),
                birth_certificate_file: serializeFilePath(req.body.birth_certificate_file?.path),
                military_service_file: serializeFilePath(req.body.military_service_file?.path),
                cv_file: serializeFilePath(req.body.cv_file?.path),
                phd_certificate_file: serializeFilePath(req.body.phd_certificate_file?.path),
                employment_contract_file: serializeFilePath(req.body.employment_contract_file?.path)
            }

            const user = await userServices.update(Number(existProfessor.dataValues.user_id), {
                first_name: data.first_name,
                last_name: data.last_name,
                national_code: data.national_code,
                gender: data.gender,
                birth_date: data.birth_date,
                phone: data.phone || undefined,
                email: data.email || undefined,
                address: data.address || undefined,
                avatar: images?.avatar,
                role: 'professor',
                password: (hashedPassword || undefined) as string
            })

            if (!user) throw new Error('بروزرسانی با مشکل مواجه شد')

            const professor = await authServices.updateProfessor(Number(professorId), {
                academic_rank: data.academic_rank,
                hire_date: data.hire_date,
                degree_id: data.degree_id,
                status: data.status,
                study_id: data.study_id,
                department_id: data.department_id,
                research_interests: data.research_interests,
                work_experience_years: data.work_experience_years,
                cv_file: images?.cv_file,
                national_card_file: images?.national_card_file,
                birth_certificate_file: images?.birth_certificate_file,
                military_service_file: images?.military_service_file,
                phd_certificate_file: images?.phd_certificate_file,
                employment_contract_file: images?.employment_contract_file,
                office_address: data.office_address,
                office_phone: data.office_phone,
                specialization: data.specialization
            })

            if (!professor) throw new Error('بروزرسانی اطلاعات با مشکل مواجه شد')

            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد'
            })
        } catch (error) {
            next(error)
        }
    }

    @Delete('/:id/delete')
    async deleteProfessor(req: Request, res: Response, next: NextFunction) {
        try {
            const professorId = req.params.id
            checkValidId(professorId)

            const existProfessor = await professorService.checkExist(Number(professorId))

            if (!existProfessor) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: httpStatus.NOT_FOUND,
                    message: 'استادی با این شناسه یافت نشد'
                })
            }

            await professorService.delete(Number(professorId))

            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد'
            })
        } catch (error) {
            next(error)
        }
    }
}

export default ProfessorController
