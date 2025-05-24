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
import entryYearCourseService from '../entryYearCourse/entryYearCourse.service'
import { EnrollmentStatusModel } from '../../models/enrollmentStatus.model'
import { Op } from 'sequelize'

const enrollmentService = {
    async list() {
        const enrollments = await EnrollmentModel.findAll({
            attributes: { exclude: ['class_schedule_id', 'student_id', 'status_id', 'updated_at', 'created_at'] },
            include: [
                {
                    model: StudentModel,
                    attributes: ['id', 'student_code'],
                    include: [{ model: UserModel, attributes: ['first_name', 'last_name', 'gender', 'national_code'] }]
                },
                {
                    model: EnrollmentStatusModel,
                    attributes: { exclude: ['id', 'enrollment_id', 'updated_at', 'created_at'] }
                },
                {
                    model: ClassScheduleModel,
                    attributes: { exclude: ['class_id', 'professor_id', 'classroom_id', 'semester_id'] },
                    include: [
                        {
                            model: ClassModel,
                            attributes: ['id', 'status', 'enrolled_students'],
                            include: [{ model: CourseModel, attributes: ['id', 'name', 'code'] }]
                        },
                        {
                            model: SemesterModel,
                            attributes: ['academic_year', 'term_number', 'start_date', 'end_date', 'status']
                        },
                        {
                            model: ClassroomModel,
                            attributes: ['name', 'building_name', 'floor_number', 'capacity']
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

        // Process each class schedule ID
        const enrollments = []
        for (const classScheduleId of enrollmentData.class_schedule_ids) {
            // Check if class schedule exists
            const classSchedule = await ClassScheduleModel.findOne({
                where: { id: Number(classScheduleId) },
                include: [{ model: ClassModel }]
            })

            if (!classSchedule) throw new Error(`برنامه جلسه با شناسه ${classScheduleId} یافت نشد`)

            // Get the class_id from the schedule and find the class directly
            const classId = classSchedule.dataValues.class_id
            const classData = await ClassModel.findByPk(classId, {
                include: [{ model: CourseModel, attributes: ['id', 'name', 'code'] }]
            })

            if (!classData) throw new Error(`کلاس مرتبط با برنامه ${classScheduleId} یافت نشد`)

            // Check if course belongs to student's entry year
            const isCourseAllowed = await entryYearCourseService.checkExistEntryYearCourseWithDetail(
                student.dataValues.entry_year.toString(),
                classData.dataValues.course_id.toString()
            )

            if (!isCourseAllowed) {
                const courseName = classData.dataValues.course?.name
                const entryYear = student.dataValues.entry_year

                throw new Error(`${courseName} برای سال ورود ${entryYear} مجاز نیست`)
            }

            // Get course details
            const courseId = classData.dataValues.course_id
            const course = await CourseModel.findByPk(courseId)
            if (!course) throw new Error('درس مورد نظر یافت نشد')

            // Get student's passed courses
            const studentEnrollments = await EnrollmentModel.findAll({
                where: { student_id: studentId },
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

            // Get list of passed course codes
            const passedCourseCodes = studentEnrollments.map(
                (enrollment) => enrollment.dataValues.class_schedule.class.course.dataValues.code
            )

            // Get current enrollment requests from the same request
            const currentRequestSchedules = await ClassScheduleModel.findAll({
                where: {
                    id: {
                        [Op.in]: enrollmentData.class_schedule_ids.map((id) => Number(id))
                    }
                },
                include: [
                    {
                        model: ClassModel,
                        include: [{ model: CourseModel }]
                    }
                ]
            })

            const currentRequestCodes = currentRequestSchedules
                .filter((schedule) => schedule.dataValues.class?.course)
                .map((schedule) => schedule.dataValues.class.course.dataValues.code)

            // Combine passed courses with current request courses
            const allCourseCodes = [...passedCourseCodes, ...currentRequestCodes]

            // Parse prerequisites and corequisites codes
            let prerequisitesCodes: string[] = []
            let corequisitesCodes: string[] = []
            try {
                prerequisitesCodes = course.dataValues.prerequisites
                corequisitesCodes = course.dataValues.corequisites
            } catch (err) {
                prerequisitesCodes = []
                corequisitesCodes = []
            }

            // Get prerequisite course codes
            const prerequisiteCourses = await CourseModel.findAll({
                where: {
                    code: {
                        [Op.in]: prerequisitesCodes
                    }
                },
                attributes: ['id', 'name', 'code']
            })

            // Check if student has passed all prerequisites or is enrolling in them now
            const missingPrerequisites = prerequisiteCourses.filter(
                (prerequisite) => !allCourseCodes.includes(prerequisite.dataValues.code)
            )

            if (missingPrerequisites.length > 0) {
                const prerequisiteNames = missingPrerequisites.map((c) => c.dataValues.name).join('، ')
                throw new Error(
                    `برای ثبت نام در درس ${course.dataValues.name} ابتدا باید درس‌${
                        missingPrerequisites.length > 1 ? 'های' : ''
                    } ${prerequisiteNames} را پاس کرده باشید یا همزمان انتخاب کنید`
                )
            }

            // Get corequisite course codes
            const corequisiteCourses = await CourseModel.findAll({
                where: {
                    code: {
                        [Op.in]: corequisitesCodes
                    }
                },
                attributes: ['id', 'name', 'code']
            })

            // Check if student is enrolled in all corequisites
            const missingCorequisites = corequisiteCourses.filter(
                (corequisite) => !allCourseCodes.includes(corequisite.dataValues.code)
            )

            if (missingCorequisites.length > 0) {
                const corequisiteNames = missingCorequisites.map((c) => c.dataValues.name).join('، ')
                throw new Error(
                    `برای ثبت نام در درس ${course.dataValues.name} باید همزمان درس‌${
                        missingCorequisites.length > 1 ? 'های' : ''
                    } ${corequisiteNames} را نیز بردارید`
                )
            }

            // بررسی وضعیت کلاس
            if (classData.dataValues.status !== 'open') {
                throw new Error(`کلاس ${classData.dataValues.course.dataValues.name} برای ثبت نام باز نیست`)
            }

            // بررسی ظرفیت کلاس
            if (classData.dataValues.enrolled_students >= classData.dataValues.capacity) {
                throw new Error(`کلاس درس ${classData.dataValues.course.dataValues.name} به حداکثر ظرفیت خود رسیده است`)
            }

            // بررسی ثبت نام دانشجویی در این برنامه جلسه
            const existingEnrollment = await EnrollmentModel.findOne({
                where: {
                    student_id: studentId,
                    class_schedule_id: Number(classScheduleId)
                }
            })

            // check student is enrolled in this class or course
            await this.checkEnrollmentOfClass(studentId, classId)

            if (existingEnrollment)
                throw new Error(`دانشجو قبلا در کلاس ${classData.dataValues.course.dataValues.name} ثبت نام کرده است`)

            // Create initial enrollment status first
            const enrollmentStatus = await EnrollmentStatusModel.create({
                status: 'pending_department_head',
                comment: 'ثبت نام اولیه'
            })

            // ثبت نام دانشجویی
            const enrollment = await EnrollmentModel.create({
                student_id: studentId,
                class_schedule_id: classScheduleId,
                status_id: enrollmentStatus.dataValues.id
            })

            // Update enrollment status with enrollment_id
            await enrollmentStatus.update({
                enrollment_id: enrollment.dataValues.id
            })

            // افزایش تعداد دانشجویان در کلاس
            await ClassModel.update(
                { enrolled_students: classData.dataValues.enrolled_students + 1 },
                { where: { id: classId } }
            )

            enrollments.push(enrollment)
        }

        return enrollments
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

    async updateEnrollmentStatus(id: number, updateData: TEnrollmentUpdateRequestBodyType, userId: number) {
        const enrollment = await EnrollmentModel.findByPk(id, {
            include: [{ model: EnrollmentStatusModel, as: 'current_status' }]
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

        const newStatus = await EnrollmentStatusModel.create(statusData)

        // Update enrollment with new status
        await enrollment.update({
            status_id: newStatus.dataValues.id
        })

        return enrollment
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

        await EnrollmentStatusModel.destroy({ where: { enrollment_id: id } })
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
                return { status: false, message: 'زمان ثبت نام فرا نرسیده است' }
            }
            case 'ended': {
                return { status: false, message: 'زمان ثبت نام به اتمام رسیده است' }
            }
            case 'no-enrollment': {
                return { status: false, message: 'زمان ثبت نام وجود ندارد' }
            }
        }

        return {
            status: true,
            message: 'زمان ثبت نام آغاز شده است'
        }
    }
}

export default enrollmentService
