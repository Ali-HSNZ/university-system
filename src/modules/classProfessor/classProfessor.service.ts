import { ClassModel } from '../../models/class.model'
import { ClassProfessorModel } from '../../models/classProfessor.model'
import { CourseModel } from '../../models/course.model'
import { DepartmentModel } from '../../models/department.model'
import { ProfessorModel } from '../../models/professor.model'
import { SemesterModel } from '../../models/semester.model'
import { UserModel } from '../../models/user.model'
import TClassProfessorInferType from './classProfessor.types'

const classProfessorService = {
    async list() {
        const classProfessors = await ClassProfessorModel.findAll({
            attributes: { exclude: ['class_id', 'professor_id'] },
            include: [
                {
                    model: ClassModel,
                    attributes: ['capacity'],
                    include: [
                        { model: CourseModel, attributes: ['name'] },
                        { model: SemesterModel, attributes: ['academic_year', 'term_number'] }
                    ]
                },
                {
                    model: ProfessorModel,
                    attributes: ['professor_code'],
                    include: [
                        { model: DepartmentModel, attributes: ['name'] },
                        { model: UserModel, attributes: ['first_name', 'last_name', 'national_code'] }
                    ]
                }
            ]
        })

        return classProfessors
    },
    async create(data: TClassProfessorInferType) {
        const classProfessor = await ClassProfessorModel.create(data)

        return classProfessor
    },
    async checkExist(class_id: number, professor_id: number) {
        const classProfessor = await ClassProfessorModel.findOne({ where: { class_id, professor_id } })
        return !!classProfessor
    },
    async info(id: number) {
        const classProfessor = await ClassProfessorModel.findByPk(id, {
            include: [{ model: ProfessorModel }, { model: ClassModel }]
        })
        return classProfessor
    },
    async delete(id: number) {
        const deletedClassProfessor = await ClassProfessorModel.update({ is_deleted: true }, { where: { id } })
        return !!deletedClassProfessor
    }
}

export default classProfessorService
