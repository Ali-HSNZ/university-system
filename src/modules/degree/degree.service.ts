import { Op } from 'sequelize'
import { DegreeModel } from '../../models/degree.model'
import { StudentModel } from '../../models/student.model'
import { UserModel } from '../../models/user.model'

const degreeServices = {
    findAll: async () => {
        const degrees = await DegreeModel.findAll({
            attributes: ['id', 'name']
        })
        return degrees
    },
    getDegreeNameById: async (id: number) => {
        const degree = await DegreeModel.findByPk(id, { attributes: ['name'] })
        return degree
    },
    checkExist: async (degree_id?: string | number) => {
        if (!degree_id) return false

        const degree = await DegreeModel.findByPk(degree_id.toString().trim())
        return !!degree
    },
    create: async (name: string) => {
        const degree = await DegreeModel.create({ name: name.trim() })
        return degree
    },
    checkExistName: async (name: string) => {
        const degree = await DegreeModel.findOne({ where: { name: name.trim() }, attributes: ['id', 'name'] })
        return degree
    },
    checkExistNameInUpdate: async (id: number, name: string) => {
        const degree = await DegreeModel.findOne({ where: { id: { [Op.ne]: id }, name: name.trim() } })
        return !!degree
    },
    checkExistId: async (id: string) => {
        const degree = await DegreeModel.findOne({ where: { id }, attributes: ['id', 'name'] })
        return degree
    },
    delete: async (id: string) => {
        const degree = await DegreeModel.destroy({ where: { id: Number(id) } })
        return degree
    },
    update: async (id: string, name: string) => {
        const degree = await DegreeModel.update({ name: name.trim() }, { where: { id: Number(id) } })
        return degree
    },
    checkUsersWithDegree: async (id: string) => {
        const users = await StudentModel.findAll({
            where: { degree_id: id },
            include: [{ model: UserModel, attributes: ['first_name', 'last_name', 'national_code'] }]
        })
        return users
    }
}

export default degreeServices
