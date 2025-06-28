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
import { StudyModel } from '../../models/study.model'
import { serializeFilePath } from '../../core/utils/serialize-file-path'
import { TUpdateStudentFilesType, TUpdateStudentInferType } from './student.types'
import { EnrollmentStatusModel } from '../../models/enrollmentStatus.model'
import enrollmentService from '../enrollment/enrollment.service'
import { GradeModel } from '../../models/grade.model'
import { AttendanceModel } from '../../models/attendance.model'
import userServices from '../user/user.service'

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
                { model: DegreeModel, attributes: { exclude: ['createdAt', 'updatedAt'] } },
                { model: StudyModel, attributes: { exclude: ['createdAt', 'updatedAt'] } },
                { model: DepartmentModel, attributes: { exclude: ['createdAt', 'updatedAt'] } },
                {
                    model: HighSchoolDiplomaModel,
                    attributes: { exclude: ['createdAt', 'updatedAt', 'user_id', 'pre_degree_id'] }
                }
            ],
            attributes: {
                exclude: [
                    'updatedAt',
                    'pre_degree_id',
                    'department_id',
                    'high_school_diploma_id',
                    'user_id',
                    'study_id',
                    'degree_id'
                ]
            }
        })

        return students.map((student) => {
            if (student.dataValues.user && student.dataValues.user.avatar) {
                student.dataValues.user.avatar = `${BASE_URL}${student.dataValues.user.avatar}`
            }
            return student
        })
    },
    checkExist: async (id: string | number | undefined) => {
        if (!id) return false

        const student = await StudentModel.findByPk(id)
        return student
    },
    checkExistByUserId: async (user_id: number) => {
        const student = await StudentModel.findOne({ where: { user_id } })
        return !!student
    },
    getByUserId: async (user_id: number | undefined) => {
        const student = await StudentModel.findOne({ where: { user_id } })
        return student
    },
    getStudentDetailByUserId: async (user_id: number | null) => {
        const student = await StudentModel.findOne({
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
                { model: DepartmentModel, attributes: { exclude: ['id', 'createdAt', 'updatedAt'] } },
                {
                    model: HighSchoolDiplomaModel,
                    attributes: { exclude: ['id', 'createdAt', 'updatedAt', 'user_id', 'pre_degree_id'] },
                    include: [{ model: DegreeModel, attributes: { exclude: ['id', 'createdAt', 'updatedAt'] } }]
                },
                {
                    model: StudyModel,
                    attributes: ['name']
                }
            ],
            attributes: {
                exclude: [
                    'updatedAt',
                    'pre_degree_id',
                    'department_id',
                    'high_school_diploma_id',
                    'user_id',
                    'degree_id',
                    'study_id'
                ]
            }
        })
        return student
    },
    getDetailById: async (id: number) => {
        const student = await StudentModel.findByPk(id, {
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
                { model: DegreeModel, attributes: { exclude: ['createdAt', 'updatedAt'] } },
                { model: DepartmentModel, attributes: { exclude: ['createdAt', 'updatedAt'] } },
                {
                    model: HighSchoolDiplomaModel,
                    attributes: { exclude: ['createdAt', 'updatedAt', 'user_id', 'pre_degree_id'] }
                },
                {
                    model: StudyModel
                }
            ],
            attributes: {
                exclude: ['updatedAt', 'pre_degree_id', 'department_id', 'high_school_diploma_id', 'user_id']
            }
        })
        return student
    },
    getAvailableClasses: async (semester_id?: number, userId?: number) => {
        // Prepare the where clause for classes

        const studentUser = await studentService.getByUserId(userId!)

        const studentUserId = studentUser?.dataValues?.id

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
    },
    update: async (studentId: number, updateData: TUpdateStudentInferType, files?: TUpdateStudentFilesType) => {
        // Get the student with user information
        const student = await StudentModel.findByPk(studentId, {
            include: [{ model: UserModel }]
        })

        if (!student) {
            throw new Error('دانشجویی با این اطلاعات یافت نشد')
        }

        const userId = student.dataValues.user_id

        // Prepare user update data
        const userUpdateData: any = {}
        if (updateData.first_name) userUpdateData.first_name = updateData.first_name
        if (updateData.last_name) userUpdateData.last_name = updateData.last_name
        if (updateData.phone !== undefined) userUpdateData.phone = updateData.phone
        if (updateData.email !== undefined) userUpdateData.email = updateData.email
        if (updateData.address !== undefined) userUpdateData.address = updateData.address
        if (files?.avatar?.[0]) {
            userUpdateData.avatar = serializeFilePath(files.avatar[0].path)
        }

        // Prepare student update data
        const studentUpdateData: any = {}
        if (updateData.guardian_name !== undefined) studentUpdateData.guardian_name = updateData.guardian_name
        if (updateData.guardian_phone !== undefined) studentUpdateData.guardian_phone = updateData.guardian_phone
        if (updateData.student_status) studentUpdateData.student_status = updateData.student_status
        if (updateData.military_status) studentUpdateData.military_status = updateData.military_status

        // Handle file uploads for student
        if (files?.national_card_image?.[0]) {
            studentUpdateData.national_card_image = serializeFilePath(files.national_card_image[0].path)
        }
        if (files?.birth_certificate_image?.[0]) {
            studentUpdateData.birth_certificate_image = serializeFilePath(files.birth_certificate_image[0].path)
        }
        if (files?.military_service_image?.[0]) {
            studentUpdateData.military_service_image = serializeFilePath(files.military_service_image[0].path)
        }

        // Update user if there are user fields to update
        if (Object.keys(userUpdateData).length > 0) {
            await UserModel.update(userUpdateData, { where: { id: userId } })
        }

        // Update student if there are student fields to update
        if (Object.keys(studentUpdateData).length > 0) {
            await StudentModel.update(studentUpdateData, { where: { id: studentId } })
        }

        // Return updated student with user information
        const updatedStudent = await StudentModel.findByPk(studentId, {
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
                { model: DegreeModel, attributes: { exclude: ['createdAt', 'updatedAt'] } },
                { model: DepartmentModel, attributes: { exclude: ['createdAt', 'updatedAt'] } },
                {
                    model: HighSchoolDiplomaModel,
                    attributes: { exclude: ['createdAt', 'updatedAt', 'user_id', 'pre_degree_id'] }
                },
                {
                    model: StudyModel,
                    attributes: ['name']
                }
            ],
            attributes: {
                exclude: ['updatedAt', 'pre_degree_id', 'department_id', 'high_school_diploma_id', 'user_id']
            }
        })

        return updatedStudent
    },
    delete: async (studentId: number) => {
        // First, check if the student exists
        const student = await StudentModel.findByPk(studentId, {
            include: [{ model: UserModel }]
        })

        if (!student) {
            throw new Error('دانشجویی با این اطلاعات یافت نشد')
        }

        const userId = student.dataValues.user.dataValues.id
        // Delete the user account
        await userServices.delete(userId)
        const user1 = await userServices.checkExistById(userId)

        // Get all enrollments for this student
        const enrollments = await EnrollmentModel.findAll({
            where: { student_id: studentId },
            attributes: ['id']
        })

        const enrollmentIds = enrollments.map((enrollment) => enrollment.dataValues.id)

        // Delete enrollment status records first
        if (enrollmentIds.length > 0) {
            await EnrollmentStatusModel.destroy({
                where: { enrollment_id: enrollmentIds }
            })
        }

        // Delete all enrollments for this student
        await EnrollmentModel.destroy({
            where: { student_id: studentId }
        })

        const user = await userServices.checkExistById(userId)
        console.log({ 'user: ': user?.dataValues, userId })

        // Delete the student record
        await StudentModel.destroy({ where: { id: studentId } })

        return true
    }
}

export default studentService
