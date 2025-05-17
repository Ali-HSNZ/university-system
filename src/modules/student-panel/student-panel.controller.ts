import { NextFunction, Request, Response } from 'express'
import { TAuthenticatedRequestType } from '../../core/types/auth'
import { Controller, Get } from '../../decorators/router.decorator'
import studentPanelService from './student-panel.service'
import httpStatus from 'http-status'
import studentService from '../student/student.service'
import { TStudentType } from '../../core/types/student'
import { TUserType } from '../../core/types/user'
import semesterService from '../semester/semester.service'

@Controller('/student-panel')
class StudentPanelController {
    @Get('/view-profile')
    async viewProfile(req: TAuthenticatedRequestType, res: Response, next: NextFunction) {
        try {
            const student = await studentService.getByUserId(req.user?.id)

            if (!student) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: httpStatus.NOT_FOUND,
                    message: 'داده ای یافت نشد'
                })
            }

            const studentProfile = await studentPanelService.profile({
                studentDTO: student as unknown as TStudentType,
                userDTO: req.user as TUserType
            })

            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: studentProfile
            })
        } catch (error) {
            next(error)
        }
    }

    @Get('/education-information')
    async educationInformation(req: TAuthenticatedRequestType, res: Response, next: NextFunction) {
        try {
            const student = await studentService.getByUserId(req.user?.id)

            if (!student) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: httpStatus.NOT_FOUND,
                    message: 'داده ای یافت نشد'
                })
            }

            const data = await studentPanelService.educationInformation(student as unknown as TStudentType)

            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data
            })
        } catch (error) {
            next(error)
        }
    }

    @Get('/current-semester-courses')
    async currentSemesterCourses(req: TAuthenticatedRequestType, res: Response, next: NextFunction) {
        try {
            const student = await studentService.getByUserId(req.user?.id)

            if (!student) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: httpStatus.NOT_FOUND,
                    message: 'داده ای یافت نشد'
                })
            }

            const activeSemester = await semesterService.getActiveSemester()

            if (!activeSemester) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: httpStatus.NOT_FOUND,
                    message: 'ترم فعالی یافت نشد'
                })
            }

            const data = await studentPanelService.currentSemesterCourses(
                activeSemester?.dataValues?.id,
                student as unknown as TStudentType
            )

            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data
            })
        } catch (error) {
            next(error)
        }
    }

    @Get('/semesters-status')
    async allSemesters(req: TAuthenticatedRequestType, res: Response, next: NextFunction) {
        try {
            const student = await studentService.getByUserId(req.user?.id)
            if (!student) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: httpStatus.NOT_FOUND,
                    message: 'داده ای یافت نشد'
                })
            }
            const data = await studentPanelService.allSemestersWithDetails(student as unknown as TStudentType)
            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data
            })
        } catch (error) {
            next(error)
        }
    }

    @Get('/current-semester-details')
    async getCurrentSemesterDetails(req: TAuthenticatedRequestType, res: Response, next: NextFunction) {
        try {
            const student = await studentService.getByUserId(req.user?.id)

            if (!student) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: httpStatus.NOT_FOUND,
                    message: 'داده ای یافت نشد'
                })
            }

            const data = await studentPanelService.getCurrentSemesterDetails(student as unknown as TStudentType)

            if (!data) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: httpStatus.NOT_FOUND,
                    message: 'هیچ ترمی برای دانشجو یافت نشد'
                })
            }

            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data
            })
        } catch (error) {
            next(error)
        }
    }
}

export default StudentPanelController

