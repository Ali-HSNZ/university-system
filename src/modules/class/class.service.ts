import { ClassModel } from '../../models/class.model'
import { CourseModel } from '../../models/course.model'
import { SemesterModel } from '../../models/semester.model'
import TClassInferType from './class.types'

const classService = {
    async list() {
        const classes = await ClassModel.findAll({
            include: [{ model: CourseModel }, { model: SemesterModel }]
        })
        return classes
    },
    async create(classDTO: TClassInferType) {
        const createdClass = await ClassModel.create(classDTO)
        return createdClass
    },
    async findOne(id: number) {
        const findClass = await ClassModel.findByPk(id, {
            include: [{ model: CourseModel }, { model: SemesterModel }]
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
