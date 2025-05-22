import { ClassModel } from '../../models/class.model'
import { ClassroomModel } from '../../models/classroom.model'
import { ClassScheduleModel } from '../../models/classSchedule.model'
import { CourseModel } from '../../models/course.model'
import { ProfessorModel } from '../../models/professor.model'
import { SemesterModel } from '../../models/semester.model'
import { UserModel } from '../../models/user.model'
import { TClassScheduleInferType, TClassScheduleListType } from './ClassSchedule.types'

const classScheduleService = {
    list: async () => {
        const classSchedule = await ClassScheduleModel.findAll({
            attributes: {
                exclude: ['class_id', 'professor_id', 'classroom_id', 'semester_id']
            },
            include: [
                {
                    model: ClassModel,
                    include: [{ model: CourseModel, attributes: ['name'] }]
                },
                { model: SemesterModel, attributes: { exclude: ['is_deleted', 'deleted_at', 'id'] } },
                { model: ClassroomModel, attributes: { exclude: ['description', 'id'] } },
                {
                    model: ProfessorModel,
                    attributes: ['id'],
                    include: [{ model: UserModel, attributes: ['id', 'first_name', 'last_name'] }]
                }
            ]
        })

        return classSchedule as unknown as TClassScheduleListType[]
    },

    groupByClass: async () => {
        const classSchedule = await classScheduleService.list()

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
                start_time: item.start_time,
                end_time: item.end_time,
                session_count: item.session_count,
                professor: item.professor,
                semester: item.semester,
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
    create: async (classSchedule: TClassScheduleInferType & { semester_id: number }) => {
        const newClassSchedule = await ClassScheduleModel.create(classSchedule)
        return newClassSchedule
    },
    delete: async (id: string) => {
        await ClassScheduleModel.destroy({ where: { id } })
        return true
    }
}

export default classScheduleService
