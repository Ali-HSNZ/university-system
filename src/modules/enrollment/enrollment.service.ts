import { EnrollmentModel } from '../../models/enrollment.model'
import { ClassModel } from '../../models/class.model'
import { UserModel } from '../../models/user.model'
import { TEnrollmentRequestBodyType, TEnrollmentUpdateRequestBodyType } from './enrollment.types'
import { StudentModel } from '../../models/student.model'

export class EnrollmentService {
    async list() {
        const enrollments = await EnrollmentModel.findAll({
            include: [{ model: UserModel }, { model: ClassModel }]
        })
        return enrollments
    }

    async createEnrollment(enrollmentData: TEnrollmentRequestBodyType) {
        // Check if student exists
        const student = await StudentModel.findOne({ where: { user_id: enrollmentData.student_id } })
        if (!student) throw new Error('دانشجویی با این شناسه یافت نشد')

        // Check if class exists and has capacity
        const classSchedule = await ClassModel.findOne({ where: { id: enrollmentData.class_schedule_id } })
        if (!classSchedule) throw new Error('برنامه جلسه با این شناسه یافت نشد')

        if (classSchedule.getDataValue('status') !== 'open') {
            throw new Error('برنامه جلسه برای ثبت نام باز نیست')
        }

        if (classSchedule.getDataValue('enrolled_students') >= classSchedule.getDataValue('capacity')) {
            throw new Error('کلاس به حداکثر ظرفیت خود رسیده است')
        }

        // Check if student is already enrolled in this class
        const existingEnrollment = await EnrollmentModel.findOne({
            where: {
                student_id: enrollmentData.student_id,
                class_schedule_id: enrollmentData.class_schedule_id
            }
        })

        if (existingEnrollment) throw new Error('دانشجو قبلا در این کلاس ثبت نام کرده است')

        // Create enrollment
        const enrollment = await EnrollmentModel.create(enrollmentData)

        // Increment enrolled students count
        await ClassModel.update(
            { enrolled_students: classSchedule.getDataValue('enrolled_students') + 1 },
            { where: { id: enrollmentData.class_schedule_id } }
        )

        return enrollment
    }

    async updateEnrollmentStatus(id: number, updateData: TEnrollmentUpdateRequestBodyType) {
        const enrollment = await EnrollmentModel.findByPk(id)
        if (!enrollment) throw new Error('ثبت نامی با این شناسه یافت نشد')

        const updated = await enrollment.update(updateData)
        return updated
    }

    async getEnrollmentById(id: number) {
        const enrollment = await EnrollmentModel.findByPk(id, {
            include: [
                { model: UserModel, attributes: ['id', 'name', 'email'] },
                { model: ClassModel, attributes: ['id', 'course_id', 'capacity', 'enrolled_students', 'status'] }
            ]
        })

        if (!enrollment) throw new Error('ثبت نامی با این شناسه یافت نشد')

        return enrollment
    }

    async getStudentEnrollments(studentId: number) {
        return EnrollmentModel.findAll({
            where: { student_id: studentId },
            include: [{ model: ClassModel }]
        })
    }

    async getClassEnrollments(classId: number) {
        return EnrollmentModel.findAll({
            where: { class_schedule_id: classId },
            include: [{ model: UserModel, attributes: ['id', 'name', 'email'] }]
        })
    }

    async deleteEnrollment(id: number) {
        const enrollment = await EnrollmentModel.findByPk(id)
        if (!enrollment) throw new Error('ثبت نامی با این شناسه یافت نشد')

        const classId = enrollment.getDataValue('class_schedule_id')
        const classData = await ClassModel.findByPk(classId)

        if (classData) {
            // Decrement enrolled students count
            await ClassModel.update(
                { enrolled_students: Math.max(0, classData.getDataValue('enrolled_students') - 1) },
                { where: { id: classId } }
            )
        }

        await enrollment.destroy()
        return { success: true, message: 'ثبت نام با موفقیت حذف شد' }
    }
}
