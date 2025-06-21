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
        // First, get all entry years
        const allEntryYears = await EntryYearModel.findAll({
            where: year ? { year } : undefined,
            include: [
                { model: DepartmentModel, attributes: ['id', 'name'] },
                { model: DegreeModel, attributes: ['id', 'name'] },
                { model: StudyModel, attributes: ['id', 'name'] }
            ],
            raw: true,
            nest: true
        })

        // Get entry year courses data
        const rawResult = await this.list(year)
        const allCourses = await courseService.getAll()

        // Create a map of entry year courses for quick lookup
        const entryYearCoursesMap = rawResult.reduce((acc, item) => {
            const entryYear = (item as any).entry_year
            const course = (item as any).course
            const yearId = entryYear.id

            if (!acc[yearId]) {
                acc[yearId] = []
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
            const prerequisites: any = allCourses
                .filter((c: any) => prerequisiteCodes.includes(c.code))
                .map((c: any) => ({ id: c.id, name: c.name, code: c.code }))

            const corequisites: any = allCourses
                .filter((c: any) => corequisiteCodes.includes(c.code))
                .map((c: any) => ({ id: c.id, name: c.name, code: c.code }))

            acc[yearId].push({
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
        }, {} as Record<number, any[]>)

        // Build the final result with all entry years
        const grouped: TEntryYearCourseGroupedType[] = allEntryYears.map((entryYear: any) => ({
            id: entryYear.id,
            year: entryYear.year,
            department: entryYear.department,
            degree: entryYear.degree,
            study: entryYear.study,
            courses: entryYearCoursesMap[entryYear.id] || []
        }))

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

    async update(entryYearId: number, courseIds: number[]) {
        // Get current course IDs for this entry year
        const existingEntryYearCourses = await EntryYearCourseModel.findAll({
            where: { entry_year_id: entryYearId }
        })

        const existingCourseIds = existingEntryYearCourses.map((eyc) => eyc.dataValues.course_id)

        // Find course IDs to add (new ones)
        const courseIdsToAdd = courseIds.filter((courseId) => !existingCourseIds.includes(courseId))

        // Find course IDs to remove (existing ones not in new list)
        const courseIdsToRemove = existingCourseIds.filter((courseId) => !courseIds.includes(courseId))

        // Add new entries
        if (courseIdsToAdd.length > 0) {
            const newEntries = courseIdsToAdd.map((courseId) => ({
                entry_year_id: entryYearId,
                course_id: courseId
            }))
            await EntryYearCourseModel.bulkCreate(newEntries)
        }

        // Remove entries that are no longer selected
        if (courseIdsToRemove.length > 0) {
            await EntryYearCourseModel.destroy({
                where: {
                    entry_year_id: entryYearId,
                    course_id: courseIdsToRemove
                }
            })
        }

        return true
    },

    async delete(entryYearId: number) {
        const result = await EntryYearCourseModel.destroy({
            where: { entry_year_id: entryYearId }
        })
        return result
    }
}

export default entryYearCourseService

