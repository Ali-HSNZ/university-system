import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import studentService from './student.service'
import { Controller, Delete, Get, Put, UseMiddleware } from '../../decorators/router.decorator'
import { TAuthenticatedRequestType } from '../../core/types/auth'
import { checkValidId } from '../../core/utils/check-valid-id'
import { fileUpload } from '../../core/utils/file-upload'
import { validationHandling } from '../../core/utils/validation-handling'
import { TUpdateStudentInferType, TUpdateStudentFilesType } from './student.types'
import { registerStudentValidation, updateStudentValidation } from '../auth/auth.validation'
import userServices from '../user/user.service'
import departmentServices from '../department/department.service'
import degreeServices from '../degree/degree.service'
import { hashString } from '../../core/utils/hash-string'
import { serializeFilePath } from '../../core/utils/serialize-file-path'
import authServices from '../auth/auth.service'
import highSchoolDiplomaServices from '../highSchoolDiploma/highSchoolDiploma.service'

// Add interface for Request with user property

@Controller('/student')
class StudentController {
    @Get('/list')
    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const students = await studentService.list()

            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: students
            })
        } catch (error) {
            next(error)
        }
    }

    @Get('/:id/info')
    async findOne(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidId(req.params.id)
            const student = await studentService.getDetailById(Number(req.params.id))

            if (!student) throw new Error('دانشجویی با این اطلاعات یافت نشد')

            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: student
            })
        } catch (error) {
            next(error)
        }
    }

    @Get('/info')
    async getByUserId(req: TAuthenticatedRequestType, res: Response, next: NextFunction) {
        try {
            const student = await studentService.getStudentDetailByUserId(req.user?.id || null)

            if (!student) throw new Error('دانشجویی با این مشخصات یافت نشد')

            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: student
            })
        } catch (error) {
            next(error)
        }
    }

    @Get('/available-classes')
    async getAvailableClasses(req: TAuthenticatedRequestType, res: Response, next: NextFunction) {
        try {
            //* 1. get student id from request
            //? 2. list of all courses for current student
            // 3. find all courses that current student is enrolled in
            // 4. remove enrolled courses from list of all courses
            // 5. return list of available classes

            const student = await studentService.getByUserId(req.user?.id)
            if (!student) throw new Error('دانشجویی با این اطلاعات یافت نشد')

            const studentId = student.dataValues.id

            const classes = await studentService.getAvailableClasses(studentId)

            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: classes
            })
        } catch (error) {
            next(error)
        }
    }

    @Put('/update')
    @UseMiddleware(
        fileUpload.fields([
            { name: 'avatar', maxCount: 1 },
            { name: 'national_card_image', maxCount: 1 },
            { name: 'birth_certificate_image', maxCount: 1 },
            { name: 'military_service_image', maxCount: 1 }
        ])
    )
    async updateProfile(req: TAuthenticatedRequestType, res: Response, next: NextFunction) {
        try {
            const files = req.files as TUpdateStudentFilesType

            // Set file paths in request body
            req.body.avatar = files?.['avatar']?.[0]
            req.body.national_card_image = files?.['national_card_image']?.[0]
            req.body.birth_certificate_image = files?.['birth_certificate_image']?.[0]
            req.body.military_service_image = files?.['military_service_image']?.[0]

            const data = await validationHandling<TUpdateStudentInferType>(req.body, updateStudentValidation)

            // Get student by user ID
            const student = await studentService.getByUserId(req.user?.id)
            if (!student) {
                throw new Error('دانشجویی با این مشخصات یافت نشد')
            }

            const updatedStudent = await studentService.update(student.dataValues.id, data, files)

            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'اطلاعات با موفقیت بروزرسانی شد',
                data: updatedStudent
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
            { name: 'military_service_image', maxCount: 1 }
        ])
    )
    async updateStudent(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidId(req.params.id)

            const existStudent = await studentService.checkExist(Number(req.params.id))
            if (!existStudent) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: httpStatus.NOT_FOUND,
                    message: 'دانشجویی با این شناسه یافت نشد'
                })
            }

            const files = req.files as TUpdateStudentFilesType

            // Set file paths in request body
            req.body.avatar = files?.['avatar']?.[0]
            req.body.national_card_image = files?.['national_card_image']?.[0]
            req.body.birth_certificate_image = files?.['birth_certificate_image']?.[0]
            req.body.military_service_image = files?.['military_service_image']?.[0]

            const data = await validationHandling<TUpdateStudentInferType>(req.body, updateStudentValidation)

            const existUser = await userServices.checkExistInUpdate(Number(existStudent.dataValues.user_id), {
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
                military_service_image: serializeFilePath(req.body.military_service_image?.path)
            }

            const user = await userServices.update(Number(existStudent.dataValues.user_id), {
                first_name: data.first_name,
                last_name: data.last_name,
                national_code: data.national_code,
                gender: data.gender,
                birth_date: data.birth_date,
                phone: data.phone || undefined,
                email: data.email || undefined,
                address: data.address || undefined,
                avatar: images?.avatar,
                role: 'student',
                password: (hashedPassword || undefined) as string
            })

            if (!user) throw new Error('بروزرسانی با مشکل مواجه شد')

            await highSchoolDiplomaServices.update(Number(existStudent.dataValues.high_school_diploma_id), {
                user_id: existStudent.dataValues.user_id,
                school_name: data.school_name,
                diploma_date: data.diploma_date,
                pre_study_id: data.pre_study_id,
                grade: data.grade
            })

            const student = await authServices.updateStudent(Number(req.params.id), {
                degree_id: data.degree_id,
                department_id: data.department_id,
                study_id: data.study_id,
                entry_year: data.entry_year,
                entry_semester: data.entry_semester,
                current_term_units: data.current_term_units,
                student_code: data.student_code,
                student_status: data.student_status,
                guardian_name: data.guardian_name,
                military_status: data.military_status,
                probation_terms: data.probation_terms,
                guardian_phone: data.guardian_phone,
                term_gpa: data.term_gpa,
                total_gpa: data.total_gpa,
                total_passed_units: data.total_passed_units,
                national_card_image: images?.national_card_image,
                birth_certificate_image: images?.birth_certificate_image,
                military_service_image: images?.military_service_image
            })

            if (!student) throw new Error('بروزرسانی اطلاعات با مشکل مواجه شد')

            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'اطلاعات با موفقیت بروزرسانی شد'
            })
        } catch (error) {
            next(error)
        }
    }

    @Delete('/:id/delete')
    async deleteStudent(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidId(req.params.id)

            const existStudent = await studentService.checkExist(Number(req.params.id))
            if (!existStudent) throw new Error('دانشجویی با این شناسه یافت نشد')

            await studentService.delete(Number(req.params.id))

            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد'
            })
        } catch (error) {
            next(error)
        }
    }
}

export default new StudentController()
