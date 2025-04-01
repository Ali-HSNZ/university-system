import { Request, Response, NextFunction } from 'express'
import { Controller, Post, UseMiddleware } from '../../decorators/router.decorator'
import { loginValidation, registerStudentValidation } from './auth.validation'
import httpStatus from 'http-status'
import authServices from './auth.services'
import { fileUpload } from '../../core/utils/file-upload'
import { TRegisterStudentFilesType, TRegisterUserType } from './auth.types'
import userServices from '../user/user.services'
import authUtils from './auth.utils'
import { validationHandling } from '../../core/utils/validation-handling'
import { tokenGenerator } from '../../core/utils/token-generator'
import degreeServices from '../degree/degree.services'
import departmentServices from '../department/department.services'
import { compareHash, hashString } from '../../core/utils/hash-string'
import highSchoolDiplomaServices from '../highSchoolDiploma/highSchoolDiploma.services'

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

            const data = await validationHandling<TRegisterUserType>(req.body, registerStudentValidation)

            const existUser = await userServices.findOne({
                national_code: req.body.national_code,
                phone: req.body.phone,
                email: req.body.email
            })

            if (existUser) {
                throw new Error('کاربر در سیستم وجود دارد')
            }

            const existDegree = await degreeServices.checkExist(data.pre_degree_id)

            if (!existDegree) {
                throw new Error('مقطع تحصیلی موجود نمی باشد')
            }

            const hashedPassword = hashString(data.national_code)

            const images = {
                avatar: (authUtils.getFilePath(req.body.avatar?.path) || null) as TRegisterUserType['avatar'],
                national_card_image: (authUtils.getFilePath(req.body.national_card_image?.path) ||
                    null) as TRegisterUserType['national_card_image'],
                birth_certificate_image: (authUtils.getFilePath(req.body.birth_certificate_image?.path) ||
                    null) as TRegisterUserType['birth_certificate_image'],
                military_service_image: (authUtils.getFilePath(req.body.military_service_image?.path) ||
                    null) as TRegisterUserType['military_service_image']
            }

            const user = await authServices.registerUser({
                ...data,
                avatar: images?.avatar,
                role: 'student',
                password: hashedPassword
            })

            if (!user || !user?.dataValues?.id) {
                throw new Error('ثبت نام با مشکل مواجه شد')
            }

            const highSchoolDiploma = await highSchoolDiplomaServices.create({
                user_id: user.dataValues.id,
                school_name: data.school_name,
                diploma_date: data.diploma_date,
                pre_degree_id: data.pre_degree_id
            })

            await authServices.registerStudent({
                user_id: user.dataValues.id,
                pre_degree_id: data.pre_degree_id,
                student_code: `${data.national_code}${user.dataValues.id}`,
                student_status: 'active',
                total_passed_units: 0,
                current_term_units: 0,
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

            const token = tokenGenerator({
                nationalCode: user.dataValues.national_code
            })

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
                    message: 'نام کاربری  اشتباه می باشد'
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
