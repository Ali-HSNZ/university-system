import { Request, Response, NextFunction } from 'express'
import { Controller, Post, UseMiddleware } from '../../decorators/router.decorator'
import { loginValidation, registerProfessorValidation, registerStudentValidation } from './auth.validation'
import httpStatus from 'http-status'
import authServices from './auth.services'
import { fileUpload } from '../../core/utils/file-upload'
import {
    TRegisterProfessorFilesType,
    TRegisterProfessorInferType,
    TRegisterStudentFilesType,
    TRegisterStudentInferType
} from './auth.types'
import userServices from '../user/user.services'
import { validationHandling } from '../../core/utils/validation-handling'
import { tokenGenerator } from '../../core/utils/token-generator'
import degreeServices from '../degree/degree.services'
import { compareHash, hashString } from '../../core/utils/hash-string'
import highSchoolDiplomaServices from '../highSchoolDiploma/highSchoolDiploma.services'
import { serializeArray } from '../../core/middleware/serialize-array'
import departmentServices from '../department/department.services'
import { serializeFilePath } from '../../core/utils/serialize-file-path'

@Controller('/auth')
class AuthController {
    @Post('/register/student')
    @UseMiddleware(
        fileUpload.fields([
            { name: 'avatar', maxCount: 1 },
            { name: 'national_card_image', maxCount: 1 },
            { name: 'birth_certificate_image', maxCount: 1 },
            { name: 'military_service_image', maxCount: 1 }
        ])
    )
    async registerStudent(req: Request, res: Response, next: NextFunction) {
        try {
            const files = req.files as TRegisterStudentFilesType

            req.body.national_card_image = files?.['national_card_image']?.[0]
            req.body.birth_certificate_image = files?.['birth_certificate_image']?.[0]
            req.body.military_service_image = files?.['military_service_image']?.[0]
            req.body.avatar = files?.['avatar']?.[0]

            const data = await validationHandling<TRegisterStudentInferType>(req.body, registerStudentValidation)

            const existUser = await userServices.findOne({
                national_code: req.body.national_code,
                phone: req.body.phone,
                email: req.body.email
            })

            if (existUser) throw new Error('کاربر در سیستم وجود دارد')
            const existDegree = await degreeServices.checkExist(data.pre_degree_id)

            if (!existDegree) throw new Error('مقطع تحصیلی موجود نمی باشد')
            const hashedPassword = hashString(data.national_code)

            const images = {
                avatar: serializeFilePath(req.body.avatar?.path) || undefined,
                national_card_image: serializeFilePath(req.body.national_card_image?.path) || undefined,
                birth_certificate_image: serializeFilePath(req.body.birth_certificate_image?.path) || undefined,
                military_service_image: serializeFilePath(req.body.military_service_image?.path) || undefined
            }

            const user = await authServices.registerUser({
                first_name: data.first_name,
                last_name: data.last_name,
                national_code: data.national_code,
                gender: data.gender,
                birth_date: data.birth_date,
                avatar: images?.avatar,
                role: 'student',
                phone: data.phone || undefined,
                email: data.email || undefined,
                address: data.address || undefined,
                password: hashedPassword
            })

            if (!user || !user?.dataValues?.id) throw new Error('ثبت نام با مشکل مواجه شد')

            const highSchoolDiploma = await highSchoolDiplomaServices.create({
                user_id: user.dataValues.id,
                school_name: data.school_name,
                diploma_date: data.diploma_date,
                pre_degree_id: data.pre_degree_id
            })

            const studentCode = `${data.national_code}${user.dataValues.id}`

            await authServices.registerStudent({
                user_id: user.dataValues.id,
                pre_degree_id: data.pre_degree_id,
                student_code: studentCode,
                student_status: 'active',
                total_passed_units: 0,
                current_term_units: 0,
                birth_date: data.birth_date,
                diploma_date: data.diploma_date,
                first_name: data.first_name,
                last_name: data.last_name,
                national_code: data.national_code,
                gender: data.gender,
                probation_terms: 0,
                term_gpa: null,
                total_gpa: null,
                military_status: 'active',
                guardian_name: data.guardian_name || null,
                guardian_phone: data.guardian_phone || null,
                high_school_diploma_id: highSchoolDiploma.dataValues.id,
                national_card_image: images?.national_card_image,
                birth_certificate_image: images?.birth_certificate_image,
                military_service_image: images?.military_service_image,
                department_id: data.department_id,
                entry_year: data.entry_year,
                entry_semester: data.entry_semester
            })

            const token = tokenGenerator({ nationalCode: user.dataValues.national_code })

            return res.status(httpStatus.CREATED).json({
                status: httpStatus.CREATED,
                data: { token },
                message: 'ثبت نام با موفقیت انجام شد'
            })
        } catch (error) {
            next(error)
        }
    }

    @Post('/register/professor')
    @UseMiddleware(
        fileUpload.fields([
            { name: 'avatar', maxCount: 1 },
            { name: 'national_card_file', maxCount: 1 },
            { name: 'birth_certificate_file', maxCount: 1 },
            { name: 'military_service_file', maxCount: 1 },
            { name: 'cv_file', maxCount: 1 },
            { name: 'phd_certificate_file', maxCount: 1 },
            { name: 'employment_contract_file', maxCount: 1 }
        ]),
        serializeArray('research_interests')
    )
    async registerProfessor(req: Request, res: Response, next: NextFunction) {
        try {
            const files = req.files as TRegisterProfessorFilesType

            req.body.avatar = files?.['avatar']?.[0]
            req.body.cv_file = files?.['cv_file']?.[0]
            req.body.national_card_file = files?.['national_card_file']?.[0]
            req.body.birth_certificate_file = files?.['birth_certificate_file']?.[0]
            req.body.military_service_file = files?.['military_service_file']?.[0]
            req.body.phd_certificate_file = files?.['phd_certificate_file']?.[0]
            req.body.employment_contract_file = files?.['employment_contract_file']?.[0]

            const data = await validationHandling<TRegisterProfessorInferType>(req.body, registerProfessorValidation)

            const existUser = await userServices.findOne({
                national_code: data.national_code,
                phone: data.phone || undefined,
                email: data.email || undefined
            })
            if (existUser) throw new Error('کاربر در سیستم وجود دارد')

            const existDepartment = await departmentServices.checkExist(data.department_id)
            if (!existDepartment) throw new Error('گروه آموزشی موجود نمی باشد')

            const existDegree = await degreeServices.checkExist(data.degree_id)
            if (!existDegree) throw new Error('مقطع تحصیلی موجود نمی باشد')

            const hashedPassword = hashString(data.national_code)

            const images = {
                avatar: serializeFilePath(req.body.avatar?.path) || undefined,
                national_card_file: serializeFilePath(req.body.national_card_file?.path) || undefined,
                birth_certificate_file: serializeFilePath(req.body.birth_certificate_file?.path) || undefined,
                military_service_file: serializeFilePath(req.body.military_service_file?.path) || undefined,
                cv_file: serializeFilePath(req.body.cv_file?.path) || undefined,
                phd_certificate_file: serializeFilePath(req.body.phd_certificate_file?.path) || undefined,
                employment_contract_file: serializeFilePath(req.body.employment_contract_file?.path) || undefined
            }

            const user = await authServices.registerUser({
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
                password: hashedPassword
            })

            if (!user || !user?.dataValues?.id) throw new Error('ثبت نام با مشکل مواجه شد')

            const professorCode = `${data.national_code}${user.dataValues.id}`

            const professor = await authServices.registerProfessor({
                user_id: user.dataValues.id,
                first_name: data.first_name,
                last_name: data.last_name,
                professor_code: professorCode,
                national_code: data.national_code,
                gender: data.gender,
                birth_date: data.birth_date,
                phone: data.phone || undefined,
                email: data.email || undefined,
                address: data.address || undefined,
                avatar: images?.avatar,
                academic_rank: data.academic_rank,
                hire_date: data.hire_date,
                degree_id: data.degree_id,
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

            if (!professor || !professor?.dataValues?.id) throw new Error('ثبت نام با مشکل مواجه شد')

            const token = tokenGenerator({ nationalCode: user.dataValues.national_code })

            return res.status(httpStatus.CREATED).json({
                status: httpStatus.CREATED,
                data: { token },
                message: 'ثبت نام با موفقیت انجام شد'
            })
        } catch (error) {
            next(error)
        }
    }

    @Post('/login')
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { national_code, password } = req.body
            await validationHandling(req.body, loginValidation)

            const user = await userServices.checkExistByNationalCode(national_code.trim())

            if (!user) {
                return res.status(httpStatus.UNAUTHORIZED).json({
                    status: httpStatus.UNAUTHORIZED,
                    message: 'نام کاربری اشتباه می باشد'
                })
            }

            const compareResult = compareHash(password, user.dataValues.password)

            if (!compareResult) {
                return res.status(httpStatus.UNAUTHORIZED).json({
                    status: httpStatus.UNAUTHORIZED,
                    message: 'نام کاربری یا رمز عبور اشتباه می باشد'
                })
            }

            const token = tokenGenerator({ nationalCode: user.dataValues.national_code })

            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                data: { token },
                message: 'ورود با موفقیت انجام شد'
            })
        } catch (error) {
            next(error)
        }
    }
}

export default new AuthController()
