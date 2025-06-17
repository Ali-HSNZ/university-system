import { Op } from 'sequelize'
import { StudyModel } from '../../models/study.model'

const studyServices = {
    list: async () => {
        const studies = await StudyModel.findAll({
            attributes: ['id', 'name', 'description']
        })
        return studies
    },
    getStudyNameById: async (id: number) => {
        const study = await StudyModel.findByPk(id)
        return study
    },

    create: async (data: { name: string; description?: string }) => {
        const study = await StudyModel.create(data)
        return study
    },

    getByName: async (name: string) => {
        const study = await StudyModel.findAll({ where: { name: name.trim() } })
        return study
    },

    checkExistIdInUpdate: async (id: string, name: string) => {
        const study = await StudyModel.findOne({ where: { id: { [Op.ne]: id }, name } })
        return !!study
    },

    checkExistId: async (id: string | number) => {
        const study = await StudyModel.findByPk(id)
        return !!study
    },

    delete: async (id: string) => {
        await StudyModel.destroy({ where: { id } })
        return true
    },

    update: async (id: string, data: { name?: string; degreeId?: number; description?: string }) => {
        const study = await StudyModel.findByPk(id)
        if (!study) {
            return false
        }
        await study.update(data)
        return true
    }
}

export default studyServices
