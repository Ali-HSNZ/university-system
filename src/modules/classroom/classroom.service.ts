import { Op } from 'sequelize'
import { ClassroomModel } from '../../models/classroom.model'
import TClassroomInferType from './classroom.types'

const classroomService = {
    async list() {
        const classrooms = await ClassroomModel.findAll()
        return classrooms
    },
    async getById(id: number | string) {
        if (!id) return null

        const classroom = await ClassroomModel.findByPk(id)
        return classroom
    },
    async checkExist(id: string | undefined) {
        if (!id) return false

        const classroom = await ClassroomModel.findByPk(id)
        return !!classroom
    },
    async checkExistClassroom(data: Omit<TClassroomInferType, 'capacity'>) {
        const classroom = await ClassroomModel.findOne({ where: data })
        return !!classroom
    },
    async create(data: TClassroomInferType) {
        const classroom = await ClassroomModel.create(data)
        return classroom
    },
    async checkExistClassroomInUpdate(id: number, data: Omit<TClassroomInferType, 'capacity'>) {
        const classroom = await ClassroomModel.findOne({ where: { id: { [Op.ne]: id }, ...data } })
        return !!classroom
    },
    async update(id: number | string, data: TClassroomInferType) {
        const classroom = await ClassroomModel.update(data, { where: { id } })
        return classroom
    },
    async delete(id: number | string) {
        const classroom = await ClassroomModel.destroy({ where: { id } })
        return !!classroom
    }
}

export default classroomService
