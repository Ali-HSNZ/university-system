import { ImportantDateModel } from '../../models/importantDate.model'
import TImportantDateInferType from './importantDate.types'

const importantDateService = {
    list: async () => {
        const importantDates = await ImportantDateModel.findAll()
        return importantDates
    },
    create: async (data: TImportantDateInferType) => {
        const importantDate = await ImportantDateModel.create(data)
        return importantDate
    },
    checkExistId: async (id: number) => {
        const importantDate = await ImportantDateModel.findByPk(id)
        return importantDate
    },
    info: async (id: number) => {
        const importantDate = await ImportantDateModel.findByPk(id)
        return importantDate
    },
    update: async (id: number, data: TImportantDateInferType) => {
        const importantDate = await ImportantDateModel.update(data, { where: { id } })
        return importantDate
    }
}

export default importantDateService
