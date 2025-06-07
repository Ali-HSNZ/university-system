import { ClassModel } from '../../models/class.model'
import { CourseModel } from '../../models/course.model'
import { TClassInferType, TUpdateClassInferType } from './class.types'

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
                }
            ]
        })
        return classes
    },
    async update(id: number, classDTO: TUpdateClassInferType) {
        const updatedClass = await ClassModel.update({ status: classDTO.status }, { where: { id } })
        return updatedClass
    },
    async existClass(course_id: number) {
        const findClass = await ClassModel.findOne({
            where: { course_id }
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
                }
            ]
        })
        return findClass
    },
    async checkExist(id: string | number | undefined) {
        if (!id) return false

        const findClass = await ClassModel.findByPk(id)
        return !!findClass
    },
    async delete(id: number) {
        const deletedClass = await ClassModel.destroy({ where: { id } })
        return deletedClass
    }
}

export default classService
