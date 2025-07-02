import { Op } from 'sequelize'
import { CourseModel } from '../../models/course.model'
import { ClassModel } from '../../models/class.model'
import { ClassScheduleModel } from '../../models/classSchedule.model'
import { EnrollmentModel } from '../../models/enrollment.model'
import { EnrollmentStatusModel } from '../../models/enrollmentStatus.model'
import TCourseInferType from './course.types'
import { Model } from 'sequelize'

interface Course {
    id: number
    name: string
    code: string
    theoretical_units: number
    practical_units: number
    type: 'public' | 'specialized' | 'basic'
    prerequisites: string[] | Course[] | null
    corequisites: string[] | Course[] | null
    dataValues: any
}

const isString = (value: any): value is string => typeof value === 'string'

const courseService = {
    getAll: async (id?: number) => {
        const courses = (await CourseModel.findAll({
            where: id ? { id } : undefined,
            attributes: [
                'id',
                'name',
                'code',
                'theoretical_units',
                'practical_units',
                'type',
                'prerequisites',
                'corequisites'
            ]
        })) as unknown as Course[]

        // Get all unique course codes from prerequisites and corequisites
        const allCourseCodes = new Set<string>()
        courses.forEach((course) => {
            if (Array.isArray(course.prerequisites)) {
                course.prerequisites.forEach((code) => {
                    if (isString(code)) {
                        allCourseCodes.add(code)
                    }
                })
            }
            if (Array.isArray(course.corequisites)) {
                course.corequisites.forEach((code) => {
                    if (isString(code)) {
                        allCourseCodes.add(code)
                    }
                })
            }
        })

        // Fetch all prerequisite and corequisite courses
        const relatedCourses = (await CourseModel.findAll({
            where: {
                code: Array.from(allCourseCodes)
            },
            attributes: ['id', 'name', 'code']
        })) as unknown as Course[]

        // Create a map for quick lookup
        const courseMap = new Map(relatedCourses.map((course) => [course.code, course]))

        // Attach the full course details to prerequisites and corequisites
        courses.forEach((course) => {
            if (Array.isArray(course.prerequisites)) {
                course.prerequisites = course.prerequisites
                    .filter(isString)
                    .map((code) => courseMap.get(code))
                    .filter(Boolean) as Course[]
            }
            if (Array.isArray(course.corequisites)) {
                course.corequisites = course.corequisites
                    .filter(isString)
                    .map((code) => courseMap.get(code))
                    .filter(Boolean) as Course[]
            }
        })

        return courses
    },
    getSummaryList: async () => {
        const courses = await CourseModel.findAll({
            attributes: ['id', 'name', 'code']
        })
        return courses
    },
    getByCode: async (code: string) => {
        const course = await CourseModel.findOne({
            where: { code: code.trim() },
            attributes: ['id', 'name']
        })
        return course
    },
    checkExistCode: async (code: string) => {
        const course = await CourseModel.findOne({ where: { code: code.trim() } })
        return course
    },
    checkExistId: async (id: number) => {
        const course = await CourseModel.findByPk(id)
        return !!course
    },

    getInfo: async (id: number) => {
        const course = await courseService.getAll(id)
        return course[0]
    },
    delete: async (id: number) => {
        // First, find all classes associated with this course
        const classes = await ClassModel.findAll({
            where: { course_id: id },
            attributes: ['id']
        })

        const classIds = classes.map((cls) => cls.dataValues.id)

        if (classIds.length > 0) {
            // Find all class schedules associated with these classes
            const classSchedules = await ClassScheduleModel.findAll({
                where: { class_id: { [Op.in]: classIds } },
                attributes: ['id']
            })

            const classScheduleIds = classSchedules.map((schedule) => schedule.dataValues.id)

            if (classScheduleIds.length > 0) {
                // Find all enrollments associated with these class schedules
                const enrollments = await EnrollmentModel.findAll({
                    where: { class_schedule_id: { [Op.in]: classScheduleIds } },
                    attributes: ['id']
                })

                const enrollmentIds = enrollments.map((enrollment) => enrollment.dataValues.id)

                if (enrollmentIds.length > 0) {
                    // Delete enrollment status records (they reference enrollment_id)
                    await EnrollmentStatusModel.destroy({
                        where: { enrollment_id: { [Op.in]: enrollmentIds } }
                    })

                    // Delete enrollment records
                    await EnrollmentModel.destroy({
                        where: { id: { [Op.in]: enrollmentIds } }
                    })
                }

                // Delete class schedule records
                await ClassScheduleModel.destroy({
                    where: { id: { [Op.in]: classScheduleIds } }
                })
            }

            // Delete class records
            await ClassModel.destroy({
                where: { id: { [Op.in]: classIds } }
            })
        }

        // Finally, delete the course
        const course = await CourseModel.destroy({ where: { id } })
        return course
    },
    count: async () => {
        const count = await CourseModel.count()
        return count
    },
    create: async (courseDTO: TCourseInferType & { code: string }) => {
        const course = await CourseModel.create(courseDTO)
        return course
    },
    update: async (id: number, courseDTO: TCourseInferType) => {
        const course = await CourseModel.update(courseDTO, { where: { id } })
        return course
    },
    checkExistName: async (name: string) => {
        const course = await CourseModel.findOne({ where: { name: name.trim() } })
        return course
    },
    checkExistNameInUpdate: async (name: string, id: string) => {
        const course = await CourseModel.findOne({ where: { name: name.trim(), id: { [Op.ne]: id } } })
        return course
    }
}

export default courseService

