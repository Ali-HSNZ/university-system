import { DegreeModel } from '../../models/degree.model'
import { UserModel } from '../../models/user.model'

const degreeServices = {
    findAll: async () => {
        const degrees = await DegreeModel.findAll({
            attributes: ['id', 'name']
        })
        return degrees
    },
    checkExist: async (degree_id?: string | number) => {
        if (!degree_id) return false

        const degree = await DegreeModel.findByPk(degree_id.toString().trim())
        return !!degree
    },
    create: async (name: string) => {
        const degree = await DegreeModel.create({ name })
        return degree
    },
    checkExistName: async (name: string) => {
        const degree = await DegreeModel.findOne({ where: { name }, attributes: ['id', 'name'] })
        return degree
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
        const degree = await DegreeModel.update({ name }, { where: { id: Number(id) } })
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
