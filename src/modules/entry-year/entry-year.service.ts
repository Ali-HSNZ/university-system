import { CourseModel } from '../../models/course.model'
import { DegreeModel } from '../../models/degree.model'
import { DepartmentModel } from '../../models/department.model'
import { EntryYearModel } from '../../models/entryYear.model'
import { StudyModel } from '../../models/study.model'
import courseService from '../course/course.service'
import TEntryYearBodyInferType from './entry-year.types'

const entryYearService = {
    async list() {
        return await EntryYearModel.findAll({
            attributes: ['id', 'year'],
            include: [
                {
                    model: DegreeModel,
                    attributes: ['name']
                },
                {
                    model: DepartmentModel,
                    attributes: ['name']
                },
                {
                    model: StudyModel,
                    attributes: ['name', 'description']
                }
            ]
        })
    },
    async getById(id: number) {
        const entryYear = await EntryYearModel.findByPk(id, {
            include: ['degree', 'department']
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
