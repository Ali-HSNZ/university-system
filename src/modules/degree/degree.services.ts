import { DegreeModel } from '../../models/degree.model'
import { UserModel } from '../../models/user.model'

const degreeServices = {
    findAll: async () => {
        const degrees = await DegreeModel.findAndCountAll({
            attributes: ['id', 'degree_name']
        })
        return degrees
    },
    create: async (name: string) => {
        const degree = await DegreeModel.create({ degree_name: name })
        return degree
    },
    checkExistName: async (name: string) => {
        const degree = await DegreeModel.findOne({ where: { degree_name: name }, attributes: ['id', 'degree_name'] })
        return degree
    },
    checkExistId: async (id: string) => {
        const degree = await DegreeModel.findOne({ where: { id: id }, attributes: ['id', 'degree_name'] })
        return degree
    },
    delete: async (id: string) => {
        const degree = await DegreeModel.destroy({ where: { id: Number(id) } })
        return degree
    },
    update: async (id: string, name: string) => {
        const degree = await DegreeModel.update({ degree_name: name }, { where: { id: Number(id) } })
        return degree
    },
    checkUsersWithDegree: async (id: string) => {
        const users = await UserModel.findOne({
            where: { degree_id: Number(id) },
            attributes: ['id', 'username', 'full_name', 'role']
        })
        return users
    }
}

export default degreeServices
