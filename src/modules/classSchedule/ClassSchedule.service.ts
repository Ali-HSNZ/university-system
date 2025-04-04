import { ClassModel } from '../../models/class.model'
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
                    model: ProfessorModel,
                    attributes: ['id'],
                    include: [{ model: UserModel, attributes: ['id', 'first_name', 'last_name'] }]
                }
            ]
        })
        return classSchedule
    },
    checkExist: async (class_id: number, professor_id: number) => {
        const classSchedule = await ClassScheduleModel.findOne({ where: { class_id, professor_id } })
        return !!classSchedule
    },
    create: async (classSchedule: TClassScheduleInferType) => {
        const newClassSchedule = await ClassScheduleModel.create(classSchedule)
        return newClassSchedule
    }
}

export default classScheduleService
