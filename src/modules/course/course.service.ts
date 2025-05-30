import { Op } from 'sequelize'
import { CourseModel } from '../../models/course.model'
import TCourseInferType from './course.types'

const courseService = {
    getAll: async () => {
        const courses = await CourseModel.findAll()
        return courses
    },
    checkExistCode: async (code: string) => {
        const course = await CourseModel.findOne({ where: { code: code.trim() } })
        return course
    },
    checkExistId: async (id: number) => {
        const course = await CourseModel.findByPk(id)
        return !!course
    },

    getInfo: async (id: number) => {
        const course = await CourseModel.findByPk(id)
        return course
    },
    delete: async (id: number) => {
        const course = await CourseModel.destroy({ where: { id } })
        return course
    },
    count: async () => {
        const count = await CourseModel.count()
        return count
    },
    create: async (courseDTO: TCourseInferType & { code: string }) => {
        const course = await CourseModel.create(courseDTO)
        return course
    },
    update: async (id: number, courseDTO: TCourseInferType) => {
        const course = await CourseModel.update(courseDTO, { where: { id } })
        return course
    },
    checkExistName: async (name: string) => {
        const course = await CourseModel.findOne({ where: { name: name.trim() } })
        return course
    },
    checkExistNameInUpdate: async (name: string, id: string) => {
        const course = await CourseModel.findOne({ where: { name: name.trim(), id: { [Op.ne]: id } } })
        return course
    }
}

export default courseService
