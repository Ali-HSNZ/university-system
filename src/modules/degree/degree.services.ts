import { DegreeModel } from '../../models/degree.model'

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
    }
}

export default degreeServices
