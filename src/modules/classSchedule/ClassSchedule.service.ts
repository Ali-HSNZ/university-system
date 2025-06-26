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
    checkDuplicateClassProfessor: async (class_id: string, professor_id: string, excludeId?: string) => {
        const whereClause: any = {
            class_id,
            professor_id
        }

        if (excludeId) {
            whereClause.id = { [Op.ne]: excludeId }
        }

        const duplicate = await ClassScheduleModel.findOne({ where: whereClause })
        return !!duplicate
    },
    create: async (classSchedule: TClassScheduleInferType & { semester_id: number }) => {
        // Check for conflicts before creating
        if (!classSchedule.classroom_id || !classSchedule.professor_id || !classSchedule.class_id) {
            throw new Error('شناسه‌های کلاس، استاد و سالن الزامی هستند')
        }

        // Check for duplicate class-professor combination
        const duplicateClassProfessor = await classScheduleService.checkDuplicateClassProfessor(
            classSchedule.class_id!,
            classSchedule.professor_id!
        )
        if (duplicateClassProfessor) {
            throw new Error('کلاس قبلاً با این استاد ایجاد شده است')
        }

        const classroomConflict = await classScheduleService.checkClassroomConflict(
            classSchedule.classroom_id!,
            classSchedule.day_of_week,
            classSchedule.start_time!,
            classSchedule.end_time!
        )
        if (classroomConflict) {
            throw new Error('سالن در این زمان در دسترس نیست')
        }

        const professorConflict = await classScheduleService.checkProfessorConflict(
            classSchedule.professor_id!,
            classSchedule.day_of_week,
            classSchedule.start_time!,
            classSchedule.end_time!
        )
        if (professorConflict) {
            throw new Error('استاد در این زمان در دسترس نیست')
        }

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
            const professorConflict = await classScheduleService.checkProfessorConflict(
                professor_id.toString(),
                day_of_week,
                start_time,
                end_time,
                id
            )
            if (professorConflict) {
                throw new Error('استاد در این زمان در دسترس نیست')
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

        // Check for duplicate class-professor combination
        if (filteredData.class_id || filteredData.professor_id) {
            const duplicateClassProfessor = await classScheduleService.checkDuplicateClassProfessor(
                class_id.toString(),
                professor_id.toString(),
                id
            )
            if (duplicateClassProfessor) {
                throw new Error('کلاس قبلاً با این استاد ایجاد شده است')
            }
        }

        const updatedClassSchedule = await ClassScheduleModel.update(filteredData, { where: { id } })
        return updatedClassSchedule
    }
}

export default classScheduleService

