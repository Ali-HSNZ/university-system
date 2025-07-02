import { Request, Response, NextFunction } from 'express'
import { Controller, Post, UseMiddleware } from '../../decorators/router.decorator'
import {
    loginValidation,
    registerEducationAssistantValidation,
    registerProfessorValidation,
    registerStudentValidation,
    registerUniversityPresidentValidation
} from './auth.validation'
import httpStatus from 'http-status'
import authServices from './auth.service'
import { fileUpload } from '../../core/utils/file-upload'
import {
    TLoginInferType,
    TRegisterEducationAssistantFilesType,
    TRegisterEducationAssistantInferType,
    TRegisterProfessorFilesType,
    TRegisterProfessorInferType,
    TRegisterStudentFilesType,
    TRegisterStudentInferType,
    TRegisterUniversityPresidentFilesType,
    TRegisterUniversityPresidentInferType
} from './auth.types'
import userServices from '../user/user.service'
import { validationHandling } from '../../core/utils/validation-handling'
import { tokenGenerator } from '../../core/utils/token-generator'
import degreeServices from '../degree/degree.service'
import { compareHash, hashString } from '../../core/utils/hash-string'
import highSchoolDiplomaServices from '../highSchoolDiploma/highSchoolDiploma.service'
import { serializeArray } from '../../core/middleware/serialize-array'
import departmentServices from '../department/department.service'
import { serializeFilePath } from '../../core/utils/serialize-file-path'
import studyServices from '../study/study.service'

@Controller('/auth')
class AuthController {
    @Post('/login')
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await validationHandling<TLoginInferType>(req.body, loginValidation)
            const user = await authServices.findOne(data.username)

            if (!user)
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: httpStatus.BAD_REQUEST,
                    message: 'کاربری با این مشخصات یافت نشد'
                })
            const isPasswordValid = compareHash(data.password, user.dataValues.password)
            if (!isPasswordValid)
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: httpStatus.BAD_REQUEST,
                    message: 'کاربری با این مشخصات یافت نشد'
                })

            const token = tokenGenerator({
                role: user.dataValues.role,
                nationalCode: user.dataValues.national_code
            })
            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'ورود با موفقیت انجام شد',
                data: { token, role: user.dataValues.role }
            })
        } catch (error) {
            next(error)
        }
    }

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

            const existPreStudy = await studyServices.checkExistId(data.pre_study_id)
            if (!existPreStudy) throw new Error('رشته تحصیلی موجود نمی باشد')

            const existDegree = await degreeServices.checkExist(data.degree_id)
            if (!existDegree) throw new Error('مقطع تحصیلی موجود نمی باشد')

            const existStudy = await studyServices.checkExistId(String(data.study_id))
            if (!existStudy) throw new Error('رشته تحصیلی موجود نمی باشد')

            const hashedPassword = hashString(data.national_code.trim())

            const images = {
                avatar: serializeFilePath(req.body.avatar?.path),
                national_card_image: serializeFilePath(req.body.national_card_image?.path),
                birth_certificate_image: serializeFilePath(req.body.birth_certificate_image?.path),
                military_service_image: serializeFilePath(req.body.military_service_image?.path)
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
                pre_study_id: data.pre_study_id,
                grade: data.grade
            })

            const studentCode = `${data.national_code}${user.dataValues.id}`

            await authServices.registerStudent({
                user_id: user.dataValues.id,
                grade: data.grade,
                student_code: studentCode,
                study_id: data.study_id,
                degree_id: data.degree_id,
                student_status: 'active',
                total_passed_units: 0,
                current_term_units: 0,
                diploma_date: data.diploma_date,
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

            return res.status(httpStatus.CREATED).json({
                status: httpStatus.CREATED,
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

            const existDepartment = await departmentServices.checkExist(Number(data.department_id))
            if (!existDepartment) throw new Error('گروه آموزشی موجود نمی باشد')

            const existDegree = await degreeServices.checkExist(data.degree_id)
            if (!existDegree) throw new Error('مقطع تحصیلی موجود نمی باشد')

            const hashedPassword = hashString(data.national_code)

            const images = {
                avatar: serializeFilePath(req.body.avatar?.path),
                national_card_file: serializeFilePath(req.body.national_card_file?.path),
                birth_certificate_file: serializeFilePath(req.body.birth_certificate_file?.path),
                military_service_file: serializeFilePath(req.body.military_service_file?.path),
                cv_file: serializeFilePath(req.body.cv_file?.path),
                phd_certificate_file: serializeFilePath(req.body.phd_certificate_file?.path),
                employment_contract_file: serializeFilePath(req.body.employment_contract_file?.path)
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
                professor_code: professorCode,
                academic_rank: data.academic_rank,
                hire_date: data.hire_date,
                degree_id: data.degree_id,
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

            if (!professor || !professor?.dataValues?.id) throw new Error('ثبت نام با مشکل مواجه شد')

            return res.status(httpStatus.CREATED).json({
                status: httpStatus.CREATED,
                message: 'ثبت نام با موفقیت انجام شد'
            })
        } catch (error) {
            next(error)
        }
    }

    @Post('/register/education-assistant')
    @UseMiddleware(
        fileUpload.fields([
            { name: 'avatar', maxCount: 1 },
            { name: 'national_card_image', maxCount: 1 },
            { name: 'birth_certificate_image', maxCount: 1 },
            { name: 'military_service_image', maxCount: 1 },
            { name: 'employment_contract_file', maxCount: 1 }
        ])
    )
    async registerEducationAssistant(req: Request, res: Response, next: NextFunction) {
        try {
            const files = req.files as TRegisterEducationAssistantFilesType

            req.body.avatar = files?.['avatar']?.[0]
            req.body.national_card_image = files?.['national_card_image']?.[0]
            req.body.birth_certificate_image = files?.['birth_certificate_image']?.[0]
            req.body.military_service_image = files?.['military_service_image']?.[0]
            req.body.employment_contract_file = files?.['employment_contract_file']?.[0]

            const data = await validationHandling<TRegisterEducationAssistantInferType>(
                req.body,
                registerEducationAssistantValidation
            )

            const existUser = await userServices.findOne({
                national_code: data.national_code,
                phone: data.phone || undefined,
                email: data.email || undefined
            })

            if (existUser) throw new Error('کاربر در سیستم وجود دارد')

            const existDepartment = await departmentServices.checkExist(data.department_id)
            if (!existDepartment) throw new Error('گروه آموزشی موجود نمی باشد')

            const existDegree = await degreeServices.checkExist(Number(data.degree_id))
            if (!existDegree) throw new Error('مقطع تحصیلی موجود نمی باشد')

            const images = {
                avatar: serializeFilePath(req.body.avatar?.path),
                national_card_image: serializeFilePath(req.body.national_card_image?.path),
                birth_certificate_image: serializeFilePath(req.body.birth_certificate_image?.path),
                military_service_image: serializeFilePath(req.body.military_service_image?.path),
                employment_contract_file: serializeFilePath(req.body.employment_contract_file?.path)
            }

            const hashedPassword = hashString(data.national_code)

            const user = await authServices.registerUser({
                first_name: data.first_name,
                last_name: data.last_name,
                national_code: data.national_code,
                gender: data.gender,
                birth_date: data.birth_date,
                role: 'education_assistant',
                password: hashedPassword,
                avatar: images?.avatar,
                phone: data.phone || undefined,
                email: data.email || undefined,
                address: data.address || undefined
            })

            if (!user || !user?.dataValues?.id) throw new Error('ثبت نام با مشکل مواجه شد')

            const educationAssistantCode = `${data.national_code}${user.dataValues.id}`

            const educationAssistant = await authServices.registerEducationAssistant({
                user_id: user.dataValues.id,
                education_assistant_code: educationAssistantCode,
                department_id: data.department_id,
                degree_id: data.degree_id,
                study_id: data.study_id,
                national_card_image: images?.national_card_image,
                work_experience_years: data.work_experience_years,
                hire_date: data.hire_date,
                responsibilities: data.responsibilities,
                employment_contract_file: images?.employment_contract_file,
                birth_certificate_image: images?.birth_certificate_image,
                military_service_image: images?.military_service_image,
                office_address: data.office_address,
                office_phone: data.office_phone,
                status: data.status
            })

            if (!educationAssistant || !educationAssistant?.dataValues?.id) throw new Error('ثبت نام با مشکل مواجه شد')

            return res.status(httpStatus.CREATED).json({
                status: httpStatus.CREATED,
                message: 'ثبت نام با موفقیت انجام شد'
            })
        } catch (error) {
            next(error)
        }
    }

    @Post('/register/department-head')
    @UseMiddleware(
        fileUpload.fields([
            { name: 'avatar', maxCount: 1 },
            { name: 'national_card_image', maxCount: 1 },
            { name: 'birth_certificate_image', maxCount: 1 },
            { name: 'military_service_image', maxCount: 1 },
            { name: 'employment_contract_file', maxCount: 1 }
        ])
    )
    async registerDepartmentHead(req: Request, res: Response, next: NextFunction) {
        try {
            const files = req.files as TRegisterEducationAssistantFilesType

            req.body.avatar = files?.['avatar']?.[0]
            req.body.national_card_image = files?.['national_card_image']?.[0]
            req.body.birth_certificate_image = files?.['birth_certificate_image']?.[0]
            req.body.military_service_image = files?.['military_service_image']?.[0]
            req.body.employment_contract_file = files?.['employment_contract_file']?.[0]

            const data = await validationHandling<TRegisterEducationAssistantInferType>(
                req.body,
                registerEducationAssistantValidation
            )

            const existUser = await userServices.findOne({
                national_code: data.national_code,
                phone: data.phone || undefined,
                email: data.email || undefined
            })

            if (existUser) throw new Error('کاربر در سیستم وجود دارد')

            const existDepartment = await departmentServices.checkExist(data.department_id)
            if (!existDepartment) throw new Error('گروه آموزشی موجود نمی باشد')

            const existDegree = await degreeServices.checkExist(Number(data.degree_id))
            if (!existDegree) throw new Error('مقطع تحصیلی موجود نمی باشد')

            const images = {
                avatar: serializeFilePath(req.body.avatar?.path),
                national_card_image: serializeFilePath(req.body.national_card_image?.path),
                birth_certificate_image: serializeFilePath(req.body.birth_certificate_image?.path),
                military_service_image: serializeFilePath(req.body.military_service_image?.path),
                employment_contract_file: serializeFilePath(req.body.employment_contract_file?.path)
            }

            const hashedPassword = hashString(data.national_code)

            const user = await authServices.registerUser({
                first_name: data.first_name,
                last_name: data.last_name,
                national_code: data.national_code,
                gender: data.gender,
                birth_date: data.birth_date,
                role: 'department_head',
                password: hashedPassword,
                avatar: images?.avatar,
                phone: data.phone || undefined,
                email: data.email || undefined,
                address: data.address || undefined
            })

            if (!user || !user?.dataValues?.id) throw new Error('ثبت نام با مشکل مواجه شد')

            const departmentHeadCode = `${data.national_code}${user.dataValues.id}`

            const departmentHead = await authServices.registerDepartmentHead({
                user_id: user.dataValues.id,
                department_head_code: departmentHeadCode,
                department_id: data.department_id,
                degree_id: data.degree_id,
                study_id: data.study_id,
                national_card_image: images?.national_card_image,
                work_experience_years: data.work_experience_years,
                hire_date: data.hire_date,
                responsibilities: data.responsibilities,
                employment_contract_file: images?.employment_contract_file,
                birth_certificate_image: images?.birth_certificate_image,
                military_service_image: images?.military_service_image,
                office_address: data.office_address,
                office_phone: data.office_phone,
                status: 'active'
            })

            if (!departmentHead || !departmentHead?.dataValues?.id) throw new Error('ثبت نام با مشکل مواجه شد')

            return res.status(httpStatus.CREATED).json({
                status: httpStatus.CREATED,
                message: 'ثبت نام با موفقیت انجام شد'
            })
        } catch (error) {
            next(error)
        }
    }

    @Post('/register/university-president')
    @UseMiddleware(
        fileUpload.fields([
            { name: 'avatar', maxCount: 1 },
            { name: 'national_card_image', maxCount: 1 },
            { name: 'birth_certificate_image', maxCount: 1 },
            { name: 'military_service_image', maxCount: 1 },
            { name: 'employment_contract_file', maxCount: 1 },
            { name: 'phd_certificate_file', maxCount: 1 }
        ])
    )
    async registerUniversityPresident(req: Request, res: Response, next: NextFunction) {
        try {
            const files = req.files as TRegisterUniversityPresidentFilesType

            req.body.avatar = files?.['avatar']?.[0]
            req.body.national_card_image = files?.['national_card_image']?.[0]
            req.body.birth_certificate_image = files?.['birth_certificate_image']?.[0]
            req.body.military_service_image = files?.['military_service_image']?.[0]
            req.body.employment_contract_file = files?.['employment_contract_file']?.[0]
            req.body.phd_certificate_file = files?.['phd_certificate_file']?.[0]

            const data = await validationHandling<TRegisterUniversityPresidentInferType>(
                req.body,
                registerUniversityPresidentValidation
            )

            const existUser = await userServices.findOne({
                national_code: data.national_code,
                phone: data.phone || undefined,
                email: data.email || undefined
            })

            if (existUser) throw new Error('کاربر در سیستم وجود دارد')

            const images = {
                avatar: serializeFilePath(req.body.avatar?.path),
                national_card_image: serializeFilePath(req.body.national_card_image?.path),
                birth_certificate_image: serializeFilePath(req.body.birth_certificate_image?.path),
                military_service_image: serializeFilePath(req.body.military_service_image?.path),
                employment_contract_file: serializeFilePath(req.body.employment_contract_file?.path),
                phd_certificate_file: serializeFilePath(req.body.phd_certificate_file?.path)
            }

            const hashedPassword = hashString(data.national_code)

            const user = await authServices.registerUser({
                first_name: data.first_name,
                last_name: data.last_name,
                national_code: data.national_code,
                gender: data.gender,
                birth_date: data.birth_date,
                role: 'university_president',
                password: hashedPassword,
                avatar: images?.avatar,
                phone: data.phone || undefined,
                email: data.email || undefined,
                address: data.address || undefined
            })

            if (!user || !user?.dataValues?.id) throw new Error('ثبت نام با مشکل مواجه شد')

            const universityPresidentCode = `${data.national_code}${user.dataValues.id}`

            const universityPresident = await authServices.registerUniversityPresident({
                user_id: user.dataValues.id,
                president_code: universityPresidentCode,
                hire_date: data.hire_date,
                work_experience_years: data.work_experience_years,
                phd_certificate_file: images?.phd_certificate_file,
                employment_contract_file: images?.employment_contract_file,
                birth_certificate_image: images?.birth_certificate_image,
                military_service_image: images?.military_service_image,
                national_card_image: images?.national_card_image,
                office_address: data.office_address,
                office_phone: data.office_phone,
                responsibilities: data.responsibilities
            })

            if (!universityPresident || !universityPresident?.dataValues?.id)
                throw new Error('ثبت نام با مشکل مواجه شد')

            return res.status(httpStatus.CREATED).json({
                status: httpStatus.CREATED,
                message: 'ثبت نام با موفقیت انجام شد'
            })
        } catch (error) {
            next(error)
        }
    }
}

export default new AuthController()
