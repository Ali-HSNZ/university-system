import { CourseModel } from '../../models/course.model'
import { DegreeModel } from '../../models/degree.model'
import { DepartmentModel } from '../../models/department.model'
import { EntryYearModel } from '../../models/entryYear.model'
import { EntryYearCourseModel } from '../../models/entryYearCourse.model'
import { StudyModel } from '../../models/study.model'
import { TEntryYearCourseBodyInferType, TEntryYearCourseGroupedType } from './entryYearCourse.types'
import courseService from '../course/course.service'

const entryYearCourseService = {
    checkExistEntryYearCourse: async (entryYearId: string, courseId: string) => {
        const entryYearCourse = await EntryYearCourseModel.findOne({
            where: { entry_year_id: entryYearId.trim(), course_id: courseId.trim() }
        })
        return !!entryYearCourse
    },

    checkExistEntryYearCourseWithDetail: async (entryYearId: string, courseId: string) => {
        const entryYearCourse = await EntryYearCourseModel.findOne({
            include: [{ model: EntryYearModel, where: { year: Number(entryYearId) } }],
            where: { course_id: Number(courseId) }
        })

        return !!entryYearCourse
    },
    async list(year?: number | null) {
        const rawResult = await EntryYearCourseModel.findAll({
            include: [
                { model: CourseModel },
                {
                    model: EntryYearModel,
                    attributes: ['id', 'year'],
                    where: year ? { year } : undefined,
                    include: [
                        { model: DepartmentModel, attributes: ['id', 'name'] },
                        { model: DegreeModel, attributes: ['id', 'name'] },
                        { model: StudyModel, attributes: ['id', 'name'] }
                    ]
                }
            ],
            raw: true,
            nest: true
        })

        return rawResult
    },

    async groupeByEntryYear(year?: number | null) {
        const rawResult = await this.list(year)
        const allCourses = await courseService.getAll()

        const grouped: TEntryYearCourseGroupedType[] = Object.values(
            rawResult.reduce((acc, item) => {
                const entryYear = (item as any).entry_year
                const course = (item as any).course
                const yearId = entryYear.id

                if (!acc[yearId]) {
                    acc[yearId] = {
                        id: entryYear.id,
                        year: entryYear.year,
                        department: entryYear.department,
                        degree: entryYear.degree,
                        study: entryYear.study,
                        courses: []
                    }
                }

                // parse prerequisites & corequisites
                let prerequisiteCodes: string[] = []
                let corequisiteCodes: string[] = []

                try {
                    prerequisiteCodes = JSON.parse(course.prerequisites || '[]')
                    corequisiteCodes = JSON.parse(course.corequisites || '[]')
                } catch (err) {
                    prerequisiteCodes = []
                    corequisiteCodes = []
                }

                // match by course code
                // پیش نیازها را از همه دروس موجود در سیستم می‌گیریم
                const prerequisites: any = allCourses
                    .filter((c: any) => prerequisiteCodes.includes(c.code))
                    .map((c: any) => ({ id: c.id, name: c.name, code: c.code }))

                // هم‌نیازها را از همه دروس موجود در سیستم می‌گیریم
                const corequisites: any = allCourses
                    .filter((c: any) => corequisiteCodes.includes(c.code))
                    .map((c: any) => ({ id: c.id, name: c.name, code: c.code }))

                acc[yearId].courses.push({
                    id: course.id,
                    name: course.name,
                    code: course.code,
                    theoretical_units: course.theoretical_units,
                    practical_units: course.practical_units,
                    type: course.type,
                    prerequisites,
                    corequisites
                })

                return acc
            }, {} as Record<number, TEntryYearCourseGroupedType>)
        )

        return grouped
    },

    async getById(id: number) {
        const entryYearCourse = await EntryYearCourseModel.findByPk(id, {
            include: ['course', 'entryYear']
        })
        if (!entryYearCourse) {
            throw new Error('دوره ورودی مورد نظر یافت نشد')
        }
        return entryYearCourse
    },

    async checkExist(id: number) {
        const entryYearCourse = await EntryYearCourseModel.findOne({
            where: { id: id.toString().trim() }
        })
        return !!entryYearCourse
    },

    async create(data: TEntryYearCourseBodyInferType) {
        return await EntryYearCourseModel.create(data)
    },

    async update(id: number, data: any) {
        const entryYearCourse = await EntryYearCourseModel.findOne({
            where: { id: id.toString().trim() }
        })
        return await entryYearCourse?.update(data)
    },

    async delete(id: number) {
        const course = await EntryYearCourseModel.destroy({ where: { id } })
        return course
    }
}

export default entryYearCourseService
