import { DegreeModel } from '../../models/degree.model'
import { UserModel } from '../../models/user.model'
import { DepartmentModel } from '../../models/department.model'
import { EducationAssistantModel } from '../../models/educationAssistant.model'
import { APP_ENV } from '../../core/config/dotenv.config'
import { DepartmentHeadModel } from '../../models/departmentHead.model'
import { EnrollmentModel } from '../../models/enrollment.model'
import { StudentModel } from '../../models/student.model'
import { ClassScheduleModel } from '../../models/classSchedule.model'
import { ClassModel } from '../../models/class.model'
import { CourseModel } from '../../models/course.model'
import { EnrollmentStatusModel } from '../../models/enrollmentStatus.model'
import { ProfessorModel } from '../../models/professor.model'
import { StudyModel } from '../../models/study.model'
import { SemesterModel } from '../../models/semester.model'
import { ClassroomModel } from '../../models/classroom.model'
import { EnrollmentType } from './departmentHead.types'

const protocol = APP_ENV.application.protocol
const host = APP_ENV.application.host
const port = APP_ENV.application.port

const BASE_URL = `${protocol}://${host}:${port}`

const departmentHeadService = {
    list: async () => {
        const departmentHeads = await DepartmentHeadModel.findAll({
            include: [
                {
                    model: UserModel,
                    attributes: {
                        exclude: [
                            'id',
                            'createdAt',
                            'updatedAt',
                            'password',
                            'is_deleted',
                            'deleted_by',
                            'deleted_at',
                            'updated_at'
                        ]
                    }
                },
                { model: DegreeModel, attributes: { exclude: ['id', 'createdAt', 'updatedAt'] } },
                { model: DepartmentModel, attributes: { exclude: ['id', 'createdAt', 'updatedAt'] } }
            ],
            attributes: {
                exclude: ['updatedAt', 'degree_id', 'department_id', 'user_id']
            }
        })

        return departmentHeads.map((departmentHead) => {
            if (departmentHead.dataValues.user && departmentHead.dataValues.user.avatar) {
                departmentHead.dataValues.user.avatar = `${BASE_URL}${departmentHead.dataValues.user.avatar}`
            }
            return departmentHead
        })
    },
    checkExistByUserId: async (user_id: number) => {
        const educationAssistant = await EducationAssistantModel.findOne({ where: { user_id } })
        return !!educationAssistant
    },
    getDepartmentEnrollments: async (userId: number) => {
        // Get department head's department
        const departmentHead = await DepartmentHeadModel.findOne({
            where: { user_id: userId },
            include: [{ model: DepartmentModel }]
        })

        if (!departmentHead) {
            throw new Error('مدیر گروه یافت نشد')
        }

        const departmentId = departmentHead.dataValues.department_id

        // Get all enrollments for students in this department
        const enrollments = await EnrollmentModel.findAll({
            include: [
                {
                    model: StudentModel,
                    where: { department_id: departmentId },
                    include: [
                        { model: UserModel, attributes: ['first_name', 'last_name', 'national_code'] },
                        {
                            model: StudyModel
                        },
                        {
                            model: DepartmentModel
                        }
                    ]
                },
                {
                    model: ClassScheduleModel,
                    include: [
                        {
                            model: ClassModel,
                            include: [{ model: CourseModel, attributes: ['name', 'code'] }]
                        },
                        {
                            model: ProfessorModel,
                            attributes: ['professor_code'],
                            include: [{ model: UserModel, attributes: ['first_name', 'last_name', 'national_code'] }]
                        },
                        {
                            model: SemesterModel
                        },
                        {
                            model: ClassroomModel
                        }
                    ]
                },
                {
                    model: EnrollmentStatusModel,
                    attributes: { exclude: ['id', 'enrollment_id', 'updated_at', 'created_at'] }
                }
            ],
            order: [['createdAt', 'DESC']]
        })

        const data = enrollments as unknown as EnrollmentType[]

        const dayOfWeekDictionary: Record<string, string> = {
            '1': 'شنبه',
            '2': 'یکشنبه',
            '3': 'دوشنبه',
            '4': 'سه شنبه',
            '5': 'چهارشنبه',
            '6': 'پنج شنبه'
        }

        const statusDictionary: Record<string, string> = {
            pending_department_head: 'در انتظار تایید مدیر گروه',
            pending_education_assistant: 'در انتظار تایید معاون آموزشی',
            approved_by_department_head: 'تایید شده توسط مدیر گروه',
            approved_by_education_assistant: 'تایید شده توسط معاون آموزشی',
            rejected_by_department_head: 'رد شده توسط مدیر گروه',
            rejected_by_education_assistant: 'رد شده توسط معاون آموزشی'
        }

        return Object.values(
            data.reduce((acc, e) => {
                const nationalCode = e.student.user.national_code
                if (!acc[nationalCode]) {
                    acc[nationalCode] = {
                        full_name: `${e.student.user.first_name} ${e.student.user.last_name}`,
                        student_code: e.student.student_code,
                        national_code: e.student.user.national_code,
                        entry_year: e.student.entry_year,
                        entry_semester: e.student.entry_semester,
                        study: e.student.study.name,
                        department: e.student.department.name,
                        enrollments: []
                    }
                }

                acc[nationalCode].enrollments.push({
                    id: e.id,
                    course: {
                        name: e.class_schedule.class.course.name,
                        code: e.class_schedule.class.course.code
                    },
                    class: {
                        professor_name:
                            e.class_schedule.professor.user.first_name +
                            ' ' +
                            e.class_schedule.professor.user.last_name,
                        professor_code: e.class_schedule.professor.professor_code,
                        day_of_week: dayOfWeekDictionary[e.class_schedule.day_of_week],
                        start_time: e.class_schedule.start_time,
                        end_time: e.class_schedule.end_time,
                        classroom:
                            e.class_schedule.classroom.building_name +
                            ' - طبقه ' +
                            e.class_schedule.classroom.floor_number +
                            ' - ' +
                            e.class_schedule.classroom.name,
                        semester:
                            e.class_schedule.semester.academic_year + ' ترم ' + e.class_schedule.semester.term_number
                    },
                    enrollment_status: {
                        code: e.enrollment_status.status,
                        status: statusDictionary[e.enrollment_status.status] || e.enrollment_status.status,
                        education_assistant_comment: e.enrollment_status.education_assistant_comment,
                        comment: e.enrollment_status.department_head_comment
                    }
                })

                return acc
            }, {} as Record<string, any>)
        )
    },
    getDepartmentHeadProfile: async (userId: number) => {
        const departmentHead = await DepartmentHeadModel.findOne({
            where: { user_id: userId },
            include: [{ model: DepartmentModel }, { model: DegreeModel }, { model: UserModel }]
        })

        return {
            profile_information: {
                full_name: `${departmentHead?.dataValues.user.first_name} ${departmentHead?.dataValues.user.last_name}`,
                national_code: departmentHead?.dataValues.user.national_code,
                gender: departmentHead?.dataValues.user.gender === 'male' ? 'آقا' : 'خانم',
                birth_date: departmentHead?.dataValues.user.birth_date,
                phone_number: departmentHead?.dataValues.user.phone,
                email: departmentHead?.dataValues.user.email,
                address: departmentHead?.dataValues?.user?.address || null,
                avatar: BASE_URL + departmentHead?.dataValues?.user?.avatar || null
            },
            work_information: {
                department_head_code: departmentHead?.dataValues.department_head_code,
                degree: departmentHead?.dataValues.degree.name,
                department: departmentHead?.dataValues.department.name,
                hire_date: departmentHead?.dataValues.hire_date,
                office_phone: departmentHead?.dataValues.office_phone,
                office_address: departmentHead?.dataValues.office_address,
                responsibilities: departmentHead?.dataValues.responsibilities,
                status: departmentHead?.dataValues.status === 'active' ? 'فعال' : 'غیرفعال'
            },
            files: {
                national_card_image: departmentHead?.dataValues.national_card_image,
                birth_certificate_image: departmentHead?.dataValues.birth_certificate_image,
                military_service_image: departmentHead?.dataValues.military_service_image,
                employment_contract_file: departmentHead?.dataValues.employment_contract_file
            }
        }
    }
}

export default departmentHeadService
