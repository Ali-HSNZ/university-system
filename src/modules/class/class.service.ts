import { ClassModel } from '../../models/class.model'
import { CourseModel } from '../../models/course.model'
import { SemesterModel } from '../../models/semester.model'
import TClassInferType from './class.types'

const classService = {
    async list() {
        const classes = await ClassModel.findAll({
            attributes: { exclude: ['course_id', 'semester_id'] },
            include: [
                {
                    model: CourseModel,
                    attributes: {
                        exclude: ['prerequisites', 'corequisites', 'total_units']
                    }
                },
                { model: SemesterModel, attributes: { exclude: ['is_deleted', 'deleted_at'] } }
            ]
        })
        return classes
    },
    async existClass(classDTO: TClassInferType) {
        const findClass = await ClassModel.findOne({
            where: { course_id: classDTO.course_id, semester_id: classDTO.semester_id }
        })
        return !!findClass
    },
    async create(classDTO: TClassInferType) {
        const createdClass = await ClassModel.create(classDTO)
        return createdClass
    },
    async findOne(id: number) {
        const findClass = await ClassModel.findByPk(id, {
            attributes: { exclude: ['course_id', 'semester_id'] },
            include: [
                {
                    model: CourseModel,
                    attributes: {
                        exclude: ['prerequisites', 'corequisites', 'total_units']
                    }
                },
                { model: SemesterModel, attributes: { exclude: ['is_deleted', 'deleted_at'] } }
            ]
        })
        return findClass
    },
    async checkExist(id: number) {
        const findClass = await ClassModel.findByPk(id)
        return !!findClass
    },
    async delete(id: number) {
        const deletedClass = await ClassModel.destroy({ where: { id } })
        return deletedClass
    }
}

export default classService
