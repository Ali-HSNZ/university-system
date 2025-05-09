import { EnrollmentModel } from '../../models/enrollment.model'
import { ClassModel } from '../../models/class.model'
import { ClassScheduleModel } from '../../models/classSchedule.model'
import { UserModel } from '../../models/user.model'
import {
    TEnrollmentRequestBodyType,
    TEnrollmentUpdateRequestBodyType,
    THandleImportantTimeStatusType
} from './enrollment.types'
import { StudentModel } from '../../models/student.model'
import { SemesterModel } from '../../models/semester.model'
import { CourseModel } from '../../models/course.model'
import { ClassroomModel } from '../../models/classroom.model'
import { ProfessorModel } from '../../models/professor.model'
import importantDateService from '../importantDate/importantDate.service'

const enrollmentService = {
    async list() {
        const enrollments = await EnrollmentModel.findAll({
            attributes: { exclude: ['class_schedule_id', 'student_id'] },
            include: [
                {
                    model: StudentModel,
                    attributes: ['id', 'student_code'],
                    include: [{ model: UserModel, attributes: ['first_name', 'last_name', 'gender', 'national_code'] }]
                },
                {
                    model: ClassScheduleModel,
                    attributes: { exclude: ['class_id', 'professor_id', 'classroom_id', 'semester_id'] },
                    include: [
                        {
                            model: ClassModel,
                            attributes: ['id', 'capacity', 'status', 'enrolled_students'],
                            include: [
                                {
                                    model: CourseModel,
                                    attributes: ['id', 'name', 'code']
                                }
                            ]
                        },
                        {
                            model: SemesterModel,
                            attributes: ['academic_year', 'term_number', 'start_date', 'end_date', 'status']
                        },
                        {
                            model: ClassroomModel,
                            attributes: ['name', 'building_name', 'floor_number']
                        },
                        {
                            model: ProfessorModel,
                            attributes: ['id'],
                            include: [{ model: UserModel, attributes: ['first_name', 'last_name'] }]
                        }
                    ]
                }
            ]
        })

        return enrollments
    },

    async createEnrollment(enrollmentData: TEnrollmentRequestBodyType) {
        // Check if student exists
        const student = await StudentModel.findOne({ where: { id: Number(enrollmentData.student_id) } })
        if (!student) throw new Error('دانشجویی با این شناسه یافت نشد')

        // Get the user_id associated with this student
        const studentId = student.dataValues.id

        // Check if class schedule exists
        const classSchedule = await ClassScheduleModel.findOne({
            where: { id: Number(enrollmentData.class_schedule_id) },
            include: [{ model: ClassModel }]
        })

        if (!classSchedule) throw new Error('برنامه جلسه با این شناسه یافت نشد')

        // Get the class_id from the schedule and find the class directly
        const classId = classSchedule.dataValues.class_id
        const classData = await ClassModel.findByPk(classId)

        if (!classData) throw new Error('کلاس مرتبط با این برنامه یافت نشد')

        // بررسی وضعیت کلاس
        if (classData.dataValues.status !== 'open') {
            throw new Error('کلاس برای ثبت نام باز نیست')
        }

        // بررسی ظرفیت کلاس
        if (classData.dataValues.enrolled_students >= classData.dataValues.capacity) {
            throw new Error('کلاس به حداکثر ظرفیت خود رسیده است')
        }

        // بررسی ثبت نام دانشجویی در این برنامه جلسه
        const existingEnrollment = await EnrollmentModel.findOne({
            where: {
                student_id: studentId,
                class_schedule_id: Number(enrollmentData.class_schedule_id)
            }
        })

        // check student is enrolled in this class or course
        await this.checkEnrollmentOfClass(studentId, classId)

        if (existingEnrollment) throw new Error('دانشجو قبلا در این کلاس ثبت نام کرده است')

        // ثبت نام دانشجویی
        const enrollment = await EnrollmentModel.create({
            student_id: studentId,
            class_schedule_id: enrollmentData.class_schedule_id,
            status: 'pending'
        })

        // افزایش تعداد دانشجویان در کلاس
        await ClassModel.update(
            { enrolled_students: classData.dataValues.enrolled_students + 1 },
            { where: { id: classId } }
        )

        return enrollment
    },
    async checkEnrollmentOfClass(student_id: number, class_id: number) {
        const allSchedulesOfThisClass = await ClassScheduleModel.findAll({
            where: { class_id },
            attributes: ['id']
        })

        // استخراج id برنامه‌ها
        const allScheduleIds = allSchedulesOfThisClass.map((s) => s.dataValues.id)

        // بررسی اینکه آیا دانشجو در یکی از این برنامه‌ها ثبت‌نام کرده
        const existingEnrollment = await EnrollmentModel.findOne({
            where: {
                student_id,
                class_schedule_id: allScheduleIds // بررسی با IN
            }
        })

        if (existingEnrollment) {
            throw new Error('دانشجو قبلاً در این کلاس ثبت‌نام کرده است')
        }
    },

    async updateEnrollmentStatus(id: number, updateData: TEnrollmentUpdateRequestBodyType) {
        const enrollment = await EnrollmentModel.findByPk(id)
        if (!enrollment) throw new Error('ثبت نامی با این شناسه یافت نشد')

        const updated = await enrollment.update(updateData)
        return updated
    },

    async getEnrollmentById(id: number) {
        const enrollment = await EnrollmentModel.findByPk(id, {
            include: [{ model: UserModel, attributes: ['id', 'name', 'email'] }, { model: ClassScheduleModel }]
        })

        if (!enrollment) throw new Error('ثبت نامی با این شناسه یافت نشد')

        // Get class data
        const result = { ...enrollment.dataValues }
        const classSchedule = enrollment.dataValues.class_schedule

        if (classSchedule) {
            const classData = await ClassModel.findByPk(classSchedule.class_id)
            if (classData) {
                result.class = classData.dataValues
            }
        }

        return result
    },

    async getStudentEnrollments(student_id: number) {
        const student = await StudentModel.findOne({ where: { id: student_id } })
        if (!student) throw new Error('دانشجویی با این شناسه یافت نشد')

        const enrollments = await EnrollmentModel.findAll({
            where: { student_id: student?.dataValues.id },
            include: [{ model: ClassScheduleModel }]
        })

        return enrollments
    },

    async getClassEnrollments(classId: number) {
        // First find the class schedules for this class
        const classSchedules = await ClassScheduleModel.findAll({
            where: { class_id: classId }
        })

        // Get the class schedule IDs
        const classScheduleIds = classSchedules.map((schedule) => schedule.dataValues.id)

        // Find enrollments for these class schedules
        const enrollments = await EnrollmentModel.findAll({
            where: { class_schedule_id: classScheduleIds },
            include: [{ model: UserModel, attributes: ['id', 'name', 'email'] }]
        })

        return enrollments
    },

    async deleteEnrollment(id: number) {
        const enrollment = await EnrollmentModel.findByPk(id)
        if (!enrollment) throw new Error('ثبت نامی با این شناسه یافت نشد')

        const classScheduleId = enrollment.dataValues.class_schedule_id

        // Get the class schedule to find the class_id
        const classSchedule = await ClassScheduleModel.findByPk(classScheduleId)

        if (classSchedule) {
            const classId = classSchedule.dataValues.class_id
            const classData = await ClassModel.findByPk(classId)

            if (classData) {
                // Decrement enrolled students count
                await ClassModel.update(
                    { enrolled_students: Math.max(0, classData.dataValues.enrolled_students - 1) },
                    { where: { id: classId } }
                )
            }
        }

        await enrollment.destroy()
        return true
    },

    async getCurrentSemesterForStudent(studentId: number) {
        const enrollments = await EnrollmentModel.findAll({
            where: { student_id: studentId },
            include: [
                {
                    model: ClassScheduleModel,
                    as: 'class_schedule',
                    include: [
                        {
                            model: ClassModel,
                            as: 'class',
                            include: [{ model: CourseModel, as: 'course' }]
                        }
                    ]
                },
                { model: StudentModel, as: 'student', include: [{ model: UserModel, as: 'user' }] }
            ]
        })

        return enrollments
    },

    async handleImportantTimeStatus({
        entry_year,
        department_id,
        degree_id,
        study_id
    }: THandleImportantTimeStatusType) {
        const checkImportantTime = await importantDateService.checkEnrollmentTime(
            entry_year,
            department_id,
            degree_id,
            study_id
        )

        switch (checkImportantTime) {
            case 'not-started': {
                return {
                    status: false,
                    message: 'زمان ثبت نام فرا نرسیده است'
                }
            }
            case 'ended': {
                return {
                    status: false,
                    message: 'زمان ثبت نام به اتمام رسیده است'
                }
            }
            case 'no-enrollment': {
                return {
                    status: false,
                    message: 'زمان ثبت نام وجود ندارد'
                }
            }
        }

        return {
            status: true,
            message: 'زمان ثبت نام صحیح است'
        }
    }
}

export default enrollmentService
