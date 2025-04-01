import { HighSchoolDiplomaModel } from '../../models/highSchoolDiploma.model'
import THighSchoolDiplomaType from './highSchoolDiploma.types'

const highSchoolDiplomaServices = {
    create: async (data: THighSchoolDiplomaType) => {
        const highSchoolDiploma = await HighSchoolDiplomaModel.create(data)
        return highSchoolDiploma
    }
}

export default highSchoolDiplomaServices
