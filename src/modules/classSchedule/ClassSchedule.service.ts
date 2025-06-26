import { ClassModel } from '../../models/class.model'
import { ClassroomModel } from '../../models/classroom.model'
import { ClassScheduleModel } from '../../models/classSchedule.model'
import { CourseModel } from '../../models/course.model'
import { ProfessorModel } from '../../models/professor.model'
import { SemesterModel } from '../../models/semester.model'
import { UserModel } from '../../models/user.model'
import { TClassScheduleInferType, TClassScheduleListType, TClassScheduleUpdateInferType } from './ClassSchedule.types'
import courseService from '../course/course.service'
import { Op } from 'sequelize'

const DAY_OF_WEEK: Record<string, string> = {
    '0': 'شنبه',
    '1': 'یکشنبه',
    '2': 'دوشنبه',
    '3': 'سه شنبه',
    '4': 'چهارشنبه',
    '5': 'پنجشنبه',
    '6': 'جمعه'
}

const classScheduleService = {
    list: async (semester_id?: string) => {
        const classSchedule = await ClassScheduleModel.findAll({
            where: semester_id ? { semester_id } : {},
            attributes: {
                exclude: ['class_id', 'professor_id', 'classroom_id', 'semester_id']
            },
            include: [
                {
                    model: ClassModel,
                    include: [{ model: CourseModel, attributes: ['name'] }]
                },
                { model: SemesterModel, attributes: { exclude: ['is_deleted', 'deleted_at', 'id'] } },
                { model: ClassroomModel, attributes: { exclude: ['description'] } },
                {
                    model: ProfessorModel,
                    attributes: ['id'],
                    include: [{ model: UserModel, attributes: ['first_name', 'last_name'] }]
                }
            ]
        })

        return classSchedule as unknown as TClassScheduleListType[]
    },

    groupByClass: async (semester_id?: string) => {
        const classSchedule = await classScheduleService.list(semester_id)

        const grouped: Record<string, any> = {}

        for (const item of classSchedule) {
            const classId = item.class.id

            if (!grouped[classId]) {
                grouped[classId] = {
                    class: item.class,
                    sessions: []
                }
            }

            grouped[classId].sessions.push({
                class_schedule_id: item.id,
                register_available: item.classroom.capacity - item.class.enrolled_students,
                day_of_week: item.day_of_week,
                start_time: item.start_time.substring(0, 5),
                end_time: item.end_time.substring(0, 5),
                session_count: item.session_count,
                professor: item.professor,
                classroom: item.classroom
            })
        }

        return Object.values(grouped)
    },

    checkExist: async (class_id: string | undefined, professor_id: string | undefined) => {
        if (!class_id || !professor_id) return false

        const classSchedule = await ClassScheduleModel.findOne({ where: { class_id, professor_id } })
        return !!classSchedule
    },
    checkExistById: async (id: string) => {
        const classSchedule = await ClassScheduleModel.findByPk(id)
        return !!classSchedule
    },
    checkClassroomConflict: async (
        classroom_id: string,
        day_of_week: string,
        start_time: string,
        end_time: string,
        excludeId?: string
    ) => {
        const whereClause: any = {
            classroom_id,
            day_of_week,
            [Op.or]: [
                // Check if new time overlaps with existing times
                {
                    start_time: { [Op.lt]: end_time },
                    end_time: { [Op.gt]: start_time }
                }
            ]
        }

        if (excludeId) {
            whereClause.id = { [Op.ne]: excludeId }
        }

        const conflict = await ClassScheduleModel.findOne({ where: whereClause })
        return !!conflict
    },
    checkProfessorConflict: async (
        professor_id: string,
        day_of_week: string,
        start_time: string,
        end_time: string,
        excludeId?: string
    ) => {
        const whereClause: any = {
            professor_id,
            day_of_week,
            [Op.or]: [
                // Check if new time overlaps with existing times
                {
                    start_time: { [Op.lt]: end_time },
                    end_time: { [Op.gt]: start_time }
                }
            ]
        }

        if (excludeId) {
            whereClause.id = { [Op.ne]: excludeId }
        }

        const conflict = await ClassScheduleModel.findOne({ where: whereClause })
        return !!conflict
    },
    checkClassConflict: async (
        class_id: string,
        day_of_week: string,
        start_time: string,
        end_time: string,
        excludeId?: string
    ) => {
        const whereClause: any = {
            class_id,
            day_of_week,
            [Op.or]: [
                // Check if new time overlaps with existing times
                {
                    start_time: { [Op.lt]: end_time },
                    end_time: { [Op.gt]: start_time }
                }
            ]
        }

        if (excludeId) {
            whereClause.id = { [Op.ne]: excludeId }
        }

        const conflict = await ClassScheduleModel.findOne({ where: whereClause })
        return !!conflict
    },
    checkExistByProfessorClassDay: async (
        professor_id: string,
        class_id: string,
        day_of_week: string,
        excludeId?: string
    ) => {
        const whereClause: any = {
            professor_id,
            class_id,
            day_of_week
        }

        if (excludeId) {
            whereClause.id = { [Op.ne]: excludeId }
        }

        const existingSchedule = await ClassScheduleModel.findOne({ where: whereClause })
        return !!existingSchedule
    },
    checkExistByCourseProfessorClassDay: async (
        course_name: string,
        professor_id: string,
        class_id: string,
        day_of_week: string,
        excludeId?: string
    ) => {
        // First find the course by name
        const course = await courseService.checkExistName(course_name)
        if (!course) {
            return false
        }

        // Find class for this course
        const classForCourse = await ClassModel.findOne({
            where: { course_id: course.dataValues.id }
        })

        if (!classForCourse) {
            return false
        }

        // Check if class schedule exists with these criteria
        const whereClause: any = {
            class_id: classForCourse.dataValues.id,
            professor_id,
            day_of_week
        }

        if (excludeId) {
            whereClause.id = { [Op.ne]: excludeId }
        }

        const existingSchedule = await ClassScheduleModel.findOne({ where: whereClause })
        return !!existingSchedule
    },
    create: async (classSchedule: TClassScheduleInferType & { semester_id: number }) => {
        // Check for conflicts before creating
        if (!classSchedule.classroom_id || !classSchedule.professor_id || !classSchedule.class_id) {
            throw new Error('شناسه‌های کلاس، استاد و سالن الزامی هستند')
        }

        // Check professor time conflicts on the same day
        const professorTimeConflicts = await classScheduleService.checkProfessorTimeConflicts(
            classSchedule.professor_id!,
            classSchedule.day_of_week,
            classSchedule.start_time!,
            classSchedule.end_time!
        )

        if (professorTimeConflicts.length > 0) {
            // Get available days for this professor at this time
            const availableDays = await classScheduleService.checkProfessorAvailableDays(
                classSchedule.professor_id!,
                classSchedule.start_time!,
                classSchedule.end_time!
            )

            const conflictDetails = professorTimeConflicts.map((conflict: any) => ({
                course_name: conflict.class?.course?.name || 'نامشخص',
                start_time: conflict.start_time,
                end_time: conflict.end_time,
                day_of_week: conflict.day_of_week
            }))

            throw new Error('استاد در این زمان در روز ' + DAY_OF_WEEK[classSchedule.day_of_week] + ' مشغول است')
        }

        // Check classroom conflict (time-based)
        const classroomConflict = await classScheduleService.checkClassroomConflict(
            classSchedule.classroom_id!,
            classSchedule.day_of_week,
            classSchedule.start_time!,
            classSchedule.end_time!
        )
        if (classroomConflict) {
            throw new Error('سالن در این زمان در دسترس نیست')
        }

        // Check class conflict (time-based) - same class can't be scheduled at same time
        const classConflict = await classScheduleService.checkClassConflict(
            classSchedule.class_id!,
            classSchedule.day_of_week,
            classSchedule.start_time!,
            classSchedule.end_time!
        )
        if (classConflict) {
            throw new Error('کلاس در این زمان در دسترس نیست')
        }

        const newClassSchedule = await ClassScheduleModel.create(classSchedule)
        return newClassSchedule
    },
    delete: async (id: string) => {
        await ClassScheduleModel.destroy({ where: { id } })
        return true
    },
    update: async (id: string, updateData: TClassScheduleUpdateInferType) => {
        // If course_name is provided, find the course and get its class
        if (updateData.course_name) {
            const course = await courseService.checkExistName(updateData.course_name)
            if (!course) {
                throw new Error('درس یافت نشد')
            }

            // Find the class for this course
            const classForCourse = await ClassModel.findOne({
                where: { course_id: course.dataValues.id }
            })

            if (!classForCourse) {
                throw new Error('کلاس برای این درس یافت نشد')
            }

            // Update the class_id with the found class
            updateData.class_id = classForCourse.dataValues.id.toString()
        }

        // Remove course_name from updateData as it's not a field in the model
        const { course_name, ...dataToUpdate } = updateData

        // Only update fields that are provided
        const filteredData = Object.fromEntries(
            Object.entries(dataToUpdate).filter(([_, value]) => value !== undefined && value !== null)
        )

        if (Object.keys(filteredData).length === 0) {
            throw new Error('هیچ فیلدی برای بروزرسانی ارائه نشده است')
        }

        // Get current class schedule to check conflicts
        const currentSchedule = await ClassScheduleModel.findByPk(id)
        if (!currentSchedule) {
            throw new Error('ساعات کلاس یافت نشد')
        }

        // Determine which fields to use for conflict checking
        const day_of_week = filteredData.day_of_week || currentSchedule.dataValues.day_of_week
        const start_time = filteredData.start_time || currentSchedule.dataValues.start_time
        const end_time = filteredData.end_time || currentSchedule.dataValues.end_time
        const classroom_id = filteredData.classroom_id || currentSchedule.dataValues.classroom_id
        const professor_id = filteredData.professor_id || currentSchedule.dataValues.professor_id
        const class_id = filteredData.class_id || currentSchedule.dataValues.class_id

        // Check classroom conflict - always check if classroom_id is being updated or if time is being updated
        if (filteredData.classroom_id || filteredData.day_of_week || filteredData.start_time || filteredData.end_time) {
            const classroomConflict = await classScheduleService.checkClassroomConflict(
                classroom_id.toString(),
                day_of_week,
                start_time,
                end_time,
                id
            )
            if (classroomConflict) {
                throw new Error('سالن در این زمان در دسترس نیست')
            }
        }

        // Check professor conflict - always check if professor_id is being updated or if time is being updated
        if (filteredData.professor_id || filteredData.day_of_week || filteredData.start_time || filteredData.end_time) {
            const professorTimeConflicts = await classScheduleService.checkProfessorTimeConflicts(
                professor_id.toString(),
                day_of_week,
                start_time,
                end_time,
                id
            )

            if (professorTimeConflicts.length > 0) {
                // Get available days for this professor at this time
                const availableDays = await classScheduleService.checkProfessorAvailableDays(
                    professor_id.toString(),
                    start_time,
                    end_time,
                    id
                )

                const conflictDetails = professorTimeConflicts.map((conflict: any) => ({
                    course_name: conflict.class?.course?.name || 'نامشخص',
                    start_time: conflict.start_time,
                    end_time: conflict.end_time,
                    day_of_week: conflict.day_of_week
                }))

                throw new Error(
                    `استاد در این زمان در روز ${day_of_week} مشغول است. تداخل‌ها: ${JSON.stringify(
                        conflictDetails
                    )}. روزهای آزاد: ${availableDays.join(', ')}`
                )
            }
        }

        // Check class conflict - always check if class_id is being updated or if time is being updated
        if (filteredData.class_id || filteredData.day_of_week || filteredData.start_time || filteredData.end_time) {
            const classConflict = await classScheduleService.checkClassConflict(
                class_id.toString(),
                day_of_week,
                start_time,
                end_time,
                id
            )
            if (classConflict) {
                throw new Error('کلاس در این زمان در دسترس نیست')
            }
        }

        const updatedClassSchedule = await ClassScheduleModel.update(filteredData, { where: { id } })
        return updatedClassSchedule
    },
    // Test method to verify conflict checking
    testConflictChecking: async () => {
        // Test data
        const testData = {
            classroom_id: '1',
            professor_id: '1',
            class_id: '1',
            day_of_week: '1',
            start_time: '08:00',
            end_time: '10:00'
        }

        console.log('Testing conflict checking...')

        // Test professor time conflicts
        const professorTimeConflicts = await classScheduleService.checkProfessorTimeConflicts(
            testData.professor_id,
            testData.day_of_week,
            testData.start_time,
            testData.end_time
        )
        console.log('Professor time conflicts:', professorTimeConflicts.length)

        // Test available days for professor
        const availableDays = await classScheduleService.checkProfessorAvailableDays(
            testData.professor_id,
            testData.start_time,
            testData.end_time
        )
        console.log('Available days for professor:', availableDays)

        // Test professor-class-day combination
        const existingProfessorClassDay = await classScheduleService.checkExistByProfessorClassDay(
            testData.professor_id,
            testData.class_id,
            testData.day_of_week
        )
        console.log('Professor-Class-Day exists:', existingProfessorClassDay)

        // Test classroom conflict
        const classroomConflict = await classScheduleService.checkClassroomConflict(
            testData.classroom_id,
            testData.day_of_week,
            testData.start_time,
            testData.end_time
        )
        console.log('Classroom conflict:', classroomConflict)

        // Test class conflict
        const classConflict = await classScheduleService.checkClassConflict(
            testData.class_id,
            testData.day_of_week,
            testData.start_time,
            testData.end_time
        )
        console.log('Class conflict:', classConflict)

        return {
            professorTimeConflicts: professorTimeConflicts.length,
            availableDays,
            existingProfessorClassDay,
            classroomConflict,
            classConflict
        }
    },
    // Test method to verify create with conflicts
    testCreateWithConflicts: async () => {
        const testData = {
            classroom_id: '1',
            professor_id: '1',
            class_id: '1',
            day_of_week: '1',
            start_time: '08:00',
            end_time: '10:00',
            semester_id: 1
        }

        try {
            console.log('Testing create with conflicts...')
            const result = await classScheduleService.create(testData)
            console.log('Create successful:', result)
            return { success: true, data: result }
        } catch (error) {
            console.log('Create failed with error:', (error as Error).message)
            return { success: false, error: (error as Error).message }
        }
    },
    checkProfessorTimeConflicts: async (
        professor_id: string,
        day_of_week: string,
        start_time: string,
        end_time: string,
        excludeId?: string
    ) => {
        const whereClause: any = {
            professor_id,
            day_of_week,
            [Op.or]: [
                // Check if new time overlaps with existing times
                {
                    start_time: { [Op.lt]: end_time },
                    end_time: { [Op.gt]: start_time }
                }
            ]
        }

        if (excludeId) {
            whereClause.id = { [Op.ne]: excludeId }
        }

        const conflicts = await ClassScheduleModel.findAll({
            where: whereClause,
            include: [
                {
                    model: ClassModel,
                    include: [{ model: CourseModel, attributes: ['name'] }]
                }
            ]
        })
        return conflicts
    },
    checkProfessorAvailableDays: async (
        professor_id: string,
        start_time: string,
        end_time: string,
        excludeId?: string
    ) => {
        // Get all days where professor has conflicts
        const conflictDays = await ClassScheduleModel.findAll({
            where: {
                professor_id,
                [Op.or]: [
                    {
                        start_time: { [Op.lt]: end_time },
                        end_time: { [Op.gt]: start_time }
                    }
                ]
            },
            attributes: ['day_of_week'],
            group: ['day_of_week'],
            raw: true
        })

        const conflictDaySet = new Set(conflictDays.map((day: any) => day.day_of_week))
        const allDays = ['0', '1', '2', '3', '4', '5', '6']
        const availableDays = allDays.filter((day) => !conflictDaySet.has(day))

        return availableDays
    }
}

export default classScheduleService

