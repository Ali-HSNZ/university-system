import { EntryYearCourseModel } from '../../models/entryYearCourse.model'

class EntryYearCourseService {
    async list() {
        return await EntryYearCourseModel.findAll({
            include: ['degree', 'course', 'department']
        })
    }

    async getById(id: number) {
        const entryYearCourse = await EntryYearCourseModel.findByPk(id, {
            include: ['degree', 'course', 'department']
        })
        if (!entryYearCourse) {
            throw new Error('دوره ورودی مورد نظر یافت نشد')
        }
        return entryYearCourse
    }

    async create(data: any) {
        return await EntryYearCourseModel.create(data)
    }

    async update(id: number, data: any) {
        const entryYearCourse = await this.getById(id)
        return await entryYearCourse.update(data)
    }

    async delete(id: number) {
        const entryYearCourse = await this.getById(id)
        await entryYearCourse.destroy()
    }
}

export default new EntryYearCourseService()
