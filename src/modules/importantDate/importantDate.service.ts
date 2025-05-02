import { DegreeModel } from '../../models/degree.model'
import { DepartmentModel } from '../../models/department.model'
import { ImportantDateModel } from '../../models/importantDate.model'
import { StudyModel } from '../../models/study.model'
import TImportantDateInferType from './importantDate.types'
import moment from 'moment-jalaali'
moment.loadPersian({ usePersianDigits: false }) // فقط یک بار اجرا شود

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
    enrollmentTimes: async () => {
        const enrollmentTimes = await ImportantDateModel.findAll({
            where: { type: 'enrollment' }
        })
        return enrollmentTimes
    },
    async getEnrollmentTime(entry_year: number | string, department_id: number, degree_id: number, study_id: number) {
        const enrollmentTimes = await ImportantDateModel.findAll({
            where: { type: 'enrollment', entry_year: Number(entry_year), department_id, degree_id, study_id }
        })
        return enrollmentTimes
    },

    async checkEnrollmentTime(entry_year: number | string, department_id: number, degree_id: number, study_id: number) {
        const nowMoment = moment()

        const enrollmentTimes = await importantDateService.getEnrollmentTime(
            entry_year,
            department_id,
            degree_id,
            study_id
        )

        if (enrollmentTimes.length === 0) return 'no-enrollment'

        let hasStarted = false
        let hasNotStarted = false

        for (const time of enrollmentTimes) {
            const startMoment = moment(time.dataValues.start_date, 'jYYYY-jMM-jDDTHH:mm')
            const endMoment = moment(time.dataValues.end_date, 'jYYYY-jMM-jDDTHH:mm')

            if (nowMoment.isSameOrAfter(startMoment) && nowMoment.isSameOrBefore(endMoment)) {
                return 'started'
            }

            if (nowMoment.isBefore(startMoment)) {
                hasNotStarted = true
            }

            if (nowMoment.isAfter(endMoment)) {
                hasStarted = true
            }
        }

        if (hasNotStarted) return 'not-started'
        if (hasStarted) return 'ended'

        return 'no-enrollment'
    },

    delete: async (id: number) => {
        const importantDate = await ImportantDateModel.destroy({ where: { id } })
        return importantDate
    }
}

export default importantDateService
