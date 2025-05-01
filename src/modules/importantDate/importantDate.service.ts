import { DegreeModel } from '../../models/degree.model'
import { DepartmentModel } from '../../models/department.model'
import { ImportantDateModel } from '../../models/importantDate.model'
import { StudyModel } from '../../models/study.model'
import TImportantDateInferType from './importantDate.types'

const importantDateService = {
    list: async () => {
        const importantDates = await ImportantDateModel.findAll({
            attributes: { exclude: ['department_id', 'degree_id', 'study_id'] },
            include: [
                { model: DepartmentModel, attributes: ['name'] },
                { model: DegreeModel, attributes: ['name'] },
                { model: StudyModel, attributes: ['name'] }
            ]
        })
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
    },
    checkExist: async (data: TImportantDateInferType) => {
        const importantDate = await ImportantDateModel.findOne({
            where: { ...data, start_date: data.start_date?.trim(), end_date: data.end_date?.trim() }
        })
        return importantDate
    },
    delete: async (id: number) => {
        const importantDate = await ImportantDateModel.destroy({ where: { id } })
        return importantDate
    }
}

export default importantDateService
