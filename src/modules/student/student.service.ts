import { APP_ENV } from '../../core/config/dotenv.config'
import { DegreeModel } from '../../models/degree.model'
import { DepartmentModel } from '../../models/department.model'
import { HighSchoolDiplomaModel } from '../../models/highSchoolDiploma.model'
import { StudentModel } from '../../models/student.model'
import { UserModel } from '../../models/user.model'
import { ClassModel } from '../../models/class.model'
import { CourseModel } from '../../models/course.model'
import { SemesterModel } from '../../models/semester.model'
import { ClassScheduleModel } from '../../models/classSchedule.model'
import { ProfessorModel } from '../../models/professor.model'
import { EnrollmentModel } from '../../models/enrollment.model'
import { Op } from 'sequelize'
import { sequelizeConfig } from '../../core/config/database.config'

const protocol = APP_ENV.application.protocol
const host = APP_ENV.application.host
const port = APP_ENV.application.port

const BASE_URL = `${protocol}://${host}:${port}`

const studentService = {
    list: async () => {
        const students = await StudentModel.findAll({
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
                { model: DepartmentModel, attributes: { exclude: ['id', 'createdAt', 'updatedAt'] } },
                {
                    model: HighSchoolDiplomaModel,
                    attributes: { exclude: ['id', 'createdAt', 'updatedAt', 'user_id', 'pre_degree_id'] },
                    include: [{ model: DegreeModel, attributes: { exclude: ['id', 'createdAt', 'updatedAt'] } }]
                }
            ],
            attributes: {
                exclude: ['updatedAt', 'pre_degree_id', 'department_id', 'high_school_diploma_id', 'user_id']
            }
        })

        return students.map((student) => {
            if (student.dataValues.user && student.dataValues.user.avatar) {
                student.dataValues.user.avatar = `${BASE_URL}${student.dataValues.user.avatar}`
            }
            return student
        })
    },
    checkExistByUserId: async (user_id: number) => {
        const student = await StudentModel.findOne({ where: { user_id } })
        return !!student
    },
    getByUserId: async (user_id: number) => {
        const student = await StudentModel.findOne({ where: { user_id } })
        return student
    },
    getAvailableClasses: async (semester_id?: number, userId?: number) => {
        // Prepare the where clause for classes

        const studentUser = await studentService.getByUserId(userId!)

        const studentUserId = studentUser?.dataValues?.id

        console.log('student user id : ', studentUserId)

        if (!studentUserId) {
            throw new Error('دانشجویی با این اطلاعات یافت نشد')
        }

        const classWhereClause: any = {
            status: 'open',
            [Op.or]: [
                {
                    enrolled_students: {
                        [Op.lt]: sequelizeConfig.col('capacity')
                    }
                },
                { enrolled_students: null }
            ]
        }

        if (semester_id) {
            classWhereClause.semester_id = semester_id
        }

        // Prepare semester where clause
        const semesterWhereClause = {
            is_deleted: false,
            status: {
                [Op.ne]: 'completed'
            }
        }

        // Get student information if userId is provided
        let student = null
        let takenCourseIds = [] as number[]

        if (studentUserId) {
            student = await StudentModel.findOne({ where: { id: studentUserId } })

            if (student) {
                // Get enrollments for this student
                const enrollments = await EnrollmentModel.findAll({
                    where: { student_id: studentUserId },
                    include: [
                        {
                            model: ClassScheduleModel,
                            include: [
                                {
                                    model: ClassModel,
                                    include: [{ model: CourseModel }]
                                }
                            ]
                        }
                    ]
                })

                // Extract course IDs from enrollments
                takenCourseIds = enrollments
                    .filter((enrollment) => enrollment.dataValues.class_schedule?.class?.course)
                    .map((enrollment) => enrollment.dataValues.class_schedule.class.course.id)
            }
        }

        const schedules = await ClassScheduleModel.findAll({
            attributes: ['id', 'day_of_week', 'start_time', 'end_time'],
            include: [
                {
                    model: ProfessorModel,
                    attributes: ['id'],
                    include: [
                        {
                            model: UserModel,
                            attributes: ['first_name', 'last_name']
                        }
                    ]
                },
                {
                    model: ClassModel,
                    where: classWhereClause,
                    include: [
                        {
                            model: CourseModel,
                            attributes: ['name', 'code', 'practical_units', 'theoretical_units']
                        },
                        {
                            model: SemesterModel,
                            attributes: ['id', 'academic_year', 'term_number'],
                            where: semesterWhereClause
                        }
                    ]
                }
            ]
        })

        // Group schedules by class
        const classMap = new Map()

        schedules.forEach((schedule) => {
            const scheduleData = schedule.toJSON()
            const classData = scheduleData.class

            if (!classData) return

            // Skip if student has already taken this course
            if (takenCourseIds.includes(classData.course?.id)) {
                return
            }

            // Format professor info
            if (scheduleData.professor && scheduleData.professor.user) {
                scheduleData.professor.name = `${scheduleData.professor.user.first_name} ${scheduleData.professor.user.last_name}`
                delete scheduleData.professor.user
            }

            // Remove the class property from schedule
            const scheduleWithoutClass = { ...scheduleData }
            delete scheduleWithoutClass.class

            if (!classMap.has(classData.id)) {
                // First time seeing this class, initialize it with schedules array
                classData.schedules = [scheduleWithoutClass]
                classMap.set(classData.id, classData)
            } else {
                // Already have this class, just add to its schedules
                const existingClass = classMap.get(classData.id)
                existingClass.schedules.push(scheduleWithoutClass)
            }
        })

        // Convert map to array
        return Array.from(classMap.values())
    }
}

export default studentService
