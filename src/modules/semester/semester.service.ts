import { Op } from 'sequelize'
import { SemesterModel } from '../../models/semester.model'

const semesterService = {
    async list() {
        const semesters = await SemesterModel.findAll()
        return semesters
    },
    async info(id: number) {
        const semester = await SemesterModel.findOne({ where: { id } })
        return semester
    },
    async create(data: any) {
        const semester = await SemesterModel.create(data)
        return semester
    },
    async checkAcademicYear(term: number, year: string) {
        const semester = await SemesterModel.findOne({
            where: { term_number: term, academic_year: year }
        })
        return semester
    },
    async checkAcademicYearInUpdate(id: number, term: number, year: string): Promise<boolean> {
        const currentSemester = await SemesterModel.findOne({ where: { id } })

        if (
            currentSemester &&
            currentSemester.dataValues.term_number === term &&
            currentSemester.dataValues.academic_year === year
        ) {
            return false
        }

        const conflictingSemester = await SemesterModel.findOne({
            where: { term_number: term, academic_year: year, id: { [Op.ne]: id } }
        })

        return !!conflictingSemester
    },
    async update(id: number, data: any) {
        const semester = await SemesterModel.update(data, { where: { id } })
        return semester
    },
    async delete(id: number) {
        const semester = await SemesterModel.update({ is_deleted: true, deleted_at: new Date() }, { where: { id } })
        return semester
    }
}

export default semesterService
