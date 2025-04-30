import { ClassModel } from '../../models/class.model'
import { ClassroomModel } from '../../models/Classroom.model'
import { ClassScheduleModel } from '../../models/classSchedule.model'
import { CourseModel } from '../../models/course.model'
import { ProfessorModel } from '../../models/professor.model'
import { SemesterModel } from '../../models/semester.model'
import { UserModel } from '../../models/user.model'
import TClassScheduleInferType from './ClassSchedule.types'

const classScheduleService = {
    list: async () => {
        const classSchedule = await ClassScheduleModel.findAll({
            attributes: {
                exclude: ['class_id', 'professor_id']
            },
            include: [
                {
                    model: ClassModel,
                    attributes: ['id'],
                    include: [
                        { model: CourseModel, attributes: ['name'] },
                        { model: SemesterModel, attributes: ['academic_year', 'term_number'] }
                    ]
                },
                {
                    model: ClassroomModel,
                    attributes: {
                        exclude: ['description', 'id']
                    }
                },
                {
                    model: ProfessorModel,
                    attributes: ['id'],
                    include: [{ model: UserModel, attributes: ['id', 'first_name', 'last_name'] }]
                }
            ]
        })

        console.log('classSchedule:', classSchedule)


        // Group by class id
        const grouped: Record<string, any> = {}
        for (const item of classSchedule) {
            const classId = (item as any).class.id
            if (!grouped[classId]) {
                grouped[classId] = {
                    class: (item as any).class,
                    sessions: []
                }
            }

            grouped[classId].sessions.push({
                class_schedule_id: (item as any).id,
                day_of_week: (item as any).day_of_week,
                start_time: (item as any).start_time,
                end_time: (item as any).end_time,
                session_count: (item as any).session_count,
                professor: (item as any).professor,
                classroom: (item as any).classroom
            })
        }

        return Object.values(grouped)
    },

    checkExist: async (class_id: string | undefined, professor_id: string | undefined) => {
        if (!class_id || !professor_id) return false

        const classSchedule = await ClassScheduleModel.findOne({ where: { class_id, professor_id } })
        return !!classSchedule
    },
    create: async (classSchedule: TClassScheduleInferType) => {
        const newClassSchedule = await ClassScheduleModel.create(classSchedule)
        return newClassSchedule
    }
}

export default classScheduleService
