import { DegreeModel } from '../../models/degree.model'
import { UserModel } from '../../models/user.model'
import { DepartmentModel } from '../../models/department.model'
import { EducationAssistantModel } from '../../models/educationAssistant.model'
import { APP_ENV } from '../../core/config/dotenv.config'
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
import { EnrollmentType, TEnrollmentUpdateRequestBodyType } from './educationAssistant.types'
import { Op } from 'sequelize'

const protocol = APP_ENV.application.protocol
const host = APP_ENV.application.host
const port = APP_ENV.application.port

const BASE_URL = `${protocol}://${host}:${port}`

const educationAssistantService = {
    list: async () => {
        const educationAssistants = await EducationAssistantModel.findAll({
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

        return educationAssistants.map((educationAssistant) => {
            if (educationAssistant.dataValues.user && educationAssistant.dataValues.user.avatar) {
                educationAssistant.dataValues.user.avatar = `${BASE_URL}${educationAssistant.dataValues.user.avatar}`
            }
            return educationAssistant
        })
    },
    checkExistByUserId: async (user_id: number) => {
        const educationAssistant = await EducationAssistantModel.findOne({ where: { user_id } })
        return !!educationAssistant
    },
    getEnrollments: async (userId: number) => {
        // Get all enrollments that have been approved by department head
        const enrollments = await EnrollmentModel.findAll({
            include: [
                {
                    model: StudentModel,
                    include: [
                        { model: UserModel, attributes: ['first_name', 'last_name', 'national_code'] },
                        { model: StudyModel },
                        { model: DepartmentModel }
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
                        { model: SemesterModel },
                        { model: ClassroomModel }
                    ]
                },
                {
                    model: EnrollmentStatusModel,
                    attributes: { exclude: ['id', 'enrollment_id', 'updated_at', 'created_at'] },
                    where: {
                        status: {
                            [Op.not]: ['pending_department_head', 'pending_education_assistant']
                        }
                    }
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
                        department_head_comment: e.enrollment_status.department_head_comment,
                        comment: e.enrollment_status.education_assistant_comment
                    },
                    department_head_comment: {
                        title: 'نظر مدیر گروه',
                        comment: e.enrollment_status.department_head_comment
                    },
                    education_assistant_comment: {
                        title: 'نظر معاون آموزشی',
                        comment: e.enrollment_status.education_assistant_comment
                    }
                })

                return acc
            }, {} as Record<string, any>)
        )
    },
    profile: async (user_id: number) => {
        const educationAssistant = await EducationAssistantModel.findOne({
            where: { user_id },
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
                exclude: ['updatedAt', 'degree_id', 'department_id']
            }
        })

        return {
            profile_information: {
                full_name: `${educationAssistant?.dataValues.user.first_name} ${educationAssistant?.dataValues.user.last_name}`,
                national_code: educationAssistant?.dataValues.user.national_code,
                gender: educationAssistant?.dataValues.user.gender === 'male' ? 'آقا' : 'خانم',
                birth_date: educationAssistant?.dataValues.user.birth_date,
                phone_number: educationAssistant?.dataValues.user.phone,
                email: educationAssistant?.dataValues.user.email,
                address: educationAssistant?.dataValues.user.address,
                avatar: BASE_URL + educationAssistant?.dataValues.user.avatar
            },
            work_information: {
                code: educationAssistant?.dataValues.education_assistant_code,
                degree: educationAssistant?.dataValues.degree.name,
                department: educationAssistant?.dataValues.department.name,
                office_address: educationAssistant?.dataValues.office_address,
                office_phone: educationAssistant?.dataValues.office_phone,
                hire_date: educationAssistant?.dataValues.hire_date,
                status: {
                    title: educationAssistant?.dataValues.status === 'inactive' ? 'غیرفعال' : 'فعال',
                    status: educationAssistant?.dataValues.status
                },
                responsibilities: educationAssistant?.dataValues.responsibilities
            },
            files: {
                national_card: educationAssistant?.dataValues.national_card_image,
                birth_certificate: educationAssistant?.dataValues.birth_certificate_image,
                military_service: educationAssistant?.dataValues.military_service_image,
                employment_contract: educationAssistant?.dataValues.employment_contract_file
            }
        }
    },
    async updateEnrollmentStatus({
        id,
        updateData,
        userId
    }: {
        id: number
        updateData: TEnrollmentUpdateRequestBodyType
        userId: number
    }) {
        const enrollment = await EnrollmentModel.findByPk(id, {
            include: [{ model: EnrollmentStatusModel, as: 'enrollment_status' }]
        })
        if (!enrollment) throw new Error('ثبت نامی با این شناسه یافت نشد')

        // Create new status record with appropriate approver ID based on status
        const statusData: any = {
            enrollment_id: enrollment.dataValues.id,
            status: updateData.status
        }

        const currentDate = new Date()

        // Set the appropriate approver ID and comment based on the status
        if (updateData.status.includes('department_head')) {
            statusData.department_head_id = userId
            statusData.department_head_comment = updateData.comment
            statusData.department_head_decision_date = currentDate
        } else if (updateData.status.includes('education_assistant')) {
            statusData.education_assistant_id = userId
            statusData.education_assistant_comment = updateData.comment
            statusData.education_assistant_decision_date = currentDate
        }

        const newStatus = await EnrollmentStatusModel.update(statusData, {
            where: { enrollment_id: enrollment.dataValues.id }
        })

        return newStatus
    }
}

export default educationAssistantService
