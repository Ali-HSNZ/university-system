import { Op } from 'sequelize'
import { SemesterModel } from '../../models/semester.model'

const semesterService = {
    async list() {
        const semesters = await SemesterModel.findAll()

        return semesters.map((e) => ({
            ...e.dataValues,
            start_date: e.dataValues.start_date.replaceAll('-', '/'),
            end_date: e.dataValues.end_date.replaceAll('-', '/')
        }))
    },
    async info(id: number) {
        const semester = await SemesterModel.findOne({ where: { id } })
        return {
            ...semester?.dataValues,
            start_date: semester?.dataValues.start_date.replaceAll('-', '/'),
            end_date: semester?.dataValues.end_date.replaceAll('-', '/')
        }
    },
    async getActiveSemester() {
        const semester = await SemesterModel.findOne({ where: { status: 'active' } })
        return semester
    },
    async create(data: any) {
        if (data.status === 'active') {
            await SemesterModel.update({ status: 'de-active' }, { where: { status: 'active' } })
        }

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
        if (data.status === 'active') {
            await SemesterModel.update({ status: 'de-active' }, { where: { status: 'active' } })
        }

        const semester = await SemesterModel.update(data, { where: { id } })
        return semester
    },
    async checkExist(id: number) {
        const semester = await SemesterModel.findByPk(id)
        return !!semester
    },
    async delete(id: number) {
        const semester = await SemesterModel.destroy({ where: { id } })
        return semester
    }
}

export default semesterService
