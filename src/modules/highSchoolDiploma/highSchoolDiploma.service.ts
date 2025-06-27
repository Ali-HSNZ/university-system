import { HighSchoolDiplomaModel } from '../../models/highSchoolDiploma.model'
import THighSchoolDiplomaType from './highSchoolDiploma.types'

const highSchoolDiplomaServices = {
    create: async (data: THighSchoolDiplomaType) => {
        const highSchoolDiploma = await HighSchoolDiplomaModel.create(data)
        return highSchoolDiploma
    },
    getHighSchoolDiplomaById: async (id: number) => {
        const highSchoolDiploma = await HighSchoolDiplomaModel.findByPk(id)
        return highSchoolDiploma
    },
    update: async (id: number, data: THighSchoolDiplomaType) => {
        const highSchoolDiploma = await HighSchoolDiplomaModel.update(data, { where: { id } })
        return highSchoolDiploma
    }
}

export default highSchoolDiplomaServices
