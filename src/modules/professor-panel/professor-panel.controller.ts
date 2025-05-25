import { Request, Response, NextFunction } from 'express'
import { Controller, Get } from '../../decorators/router.decorator'
import professorPanelService from './professor-panel.service'
import httpStatus from 'http-status'
import professorService from '../professor/professor.service'
import { TAuthenticatedRequestType } from '../../core/types/auth'
import { TUserType } from '../../core/types/user'
import { TProfessorType } from '../../core/types/professor'

interface ISemesterGroup {
    academic_year: string
    term_number: string
    status: string
    classes: Array<{
        course_name: string
        course_code: string
        student_count: number
        classroom: string
        students: any[]
    }>
    total_students: number
}

interface ISemesterGroups {
    [key: string]: ISemesterGroup
}

@Controller('/professor-panel')
export class ProfessorPanelController {
    @Get('/profile')
    async viewProfile(req: TAuthenticatedRequestType, res: Response, next: NextFunction) {
        try {
            const professor = await professorService.getByUserId(req.user?.id)

            if (!professor) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: httpStatus.NOT_FOUND,
                    message: 'داده ای یافت نشد'
                })
            }

            const professorProfile = await professorPanelService.profile({
                professorDTO: professor as unknown as TProfessorType,
                userDTO: req.user as TUserType
            })

            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: professorProfile
            })
        } catch (error) {
            next(error)
        }
    }

    @Get('/class-list')
    async getClasses(req: TAuthenticatedRequestType, res: Response, next: NextFunction) {
        try {
            const professor = await professorService.getByUserId(req.user?.id)
            if (!professor) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: httpStatus.BAD_REQUEST,
                    message: 'استاد با این مشخصات یافت نشد'
                })
            }

            const classList = await professorPanelService.list(professor.dataValues.id.toString())

            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: classList
            })
        } catch (error) {
            next(error)
        }
    }

    @Get('/dashboard')
    async getDashboard(req: TAuthenticatedRequestType, res: Response, next: NextFunction) {
        try {
            const professor = await professorService.getByUserId(req.user?.id)
            if (!professor) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    status: httpStatus.BAD_REQUEST,
                    message: 'استاد با این مشخصات یافت نشد'
                })
            }

            const classList = await professorPanelService.list(professor.dataValues.id.toString())

            // Filter classes with active semester
            const activeClasses = classList.filter((cls) => cls.semester.status === 'active')

            // Group classes by semester
            const semesterGroups = activeClasses.reduce<ISemesterGroups>((groups, cls) => {
                const semesterKey = `${cls.semester.academic_year}-${cls.semester.term_number}`
                if (!groups[semesterKey]) {
                    groups[semesterKey] = {
                        academic_year: cls.semester.academic_year,
                        term_number: cls.semester.term_number,
                        status: cls.semester.status,
                        classes: [],
                        total_students: 0
                    }
                }
                groups[semesterKey].classes.push({
                    course_name: cls.course.name,
                    course_code: cls.course.code,
                    student_count: cls.students.length,
                    classroom: cls.classroom.building + ' - طبقه ' + cls.classroom.floor + ' - ' + cls.classroom.name,
                    students: cls.students
                })
                groups[semesterKey].total_students += cls.students.length
                return groups
            }, {})

            // Get active semester data
            const activeSemester = Object.values(semesterGroups).find((semester) => semester.status === 'active')

            // Calculate total students across all semesters
            const totalStudentsAllSemesters = classList.reduce((sum, cls) => sum + cls.students.length, 0)

            const summary = {
                total_classes: activeClasses.length,
                total_semesters: Object.keys(semesterGroups).length,
                total_students: totalStudentsAllSemesters,
                active_semester_values: {
                    total_students: activeSemester?.total_students || 0,
                    total_classes: activeSemester?.classes.length || 0,
                    semester: activeSemester
                        ? `${activeSemester.academic_year} - ترم ${activeSemester.term_number}`
                        : null,
                    status: activeSemester?.status || null
                },
                semesters: Object.values(semesterGroups).map((semester) => ({
                    semester: `${semester.academic_year} - ترم ${semester.term_number}`,
                    status: semester.status,
                    total_classes: semester.classes.length,
                    total_students: semester.total_students,
                    classes: semester.classes
                }))
            }

            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: summary
            })
        } catch (error) {
            next(error)
        }
    }
}
