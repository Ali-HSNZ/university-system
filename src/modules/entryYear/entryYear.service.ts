import { Op } from 'sequelize'
import { DegreeModel } from '../../models/degree.model'
import { DepartmentModel } from '../../models/department.model'
import { EntryYearModel } from '../../models/entryYear.model'
import { StudyModel } from '../../models/study.model'
import TEntryYearBodyInferType from './entryYear.types'

const entryYearService = {
    async list() {
        return await EntryYearModel.findAll({
            attributes: ['id', 'year'],
            include: [
                { model: DegreeModel },
                { model: DepartmentModel },
                { model: StudyModel, attributes: ['name', 'id'] }
            ]
        })
    },
    checkExistEntryYear: async (year: number) => {
        const entryYear = await EntryYearModel.findOne({ where: { year } })
        return !!entryYear
    },
    checkExistEntryYearInUpdate: async (
        id: number,
        data: {
            year: number
            degree_id: number
            study_id: number
            department_id: number
        }
    ) => {
        const entryYear = await EntryYearModel.findOne({ where: { ...data, id: { [Op.ne]: id } } })
        return !!entryYear
    },
    checkExistEntryYearInAdd: async (data: {
        year: number
        degree_id: number
        study_id: number
        department_id: number
    }) => {
        const entryYear = await EntryYearModel.findOne({ where: data })
        return !!entryYear
    },
    async getById(id: number) {
        const entryYear = await EntryYearModel.findByPk(id, {
            include: ['degree', 'department', 'study']
        })
        if (!entryYear) {
            throw new Error('دوره ورودی مورد نظر یافت نشد')
        }
        return entryYear
    },

    async create(data: TEntryYearBodyInferType) {
        return await EntryYearModel.create(data)
    },

    async update(id: number, data: any) {
        const entryYear = await this.getById(id)
        return await entryYear.update(data)
    },

    async delete(id: number) {
        const entryYear = await this.getById(id)
        await entryYear.destroy()
    }
}

export default entryYearService
