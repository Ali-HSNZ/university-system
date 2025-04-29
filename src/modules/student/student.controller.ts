import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import studentService from './student.service'
import { Controller, Get } from '../../decorators/router.decorator'
import { TAuthenticatedRequestType } from '../../core/types/auth'
import { checkValidId } from '../../core/utils/check-valid-id'

// Add interface for Request with user property

@Controller('/student')
class StudentController {
    @Get('/list')
    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const students = await studentService.list()

            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: students
            })
        } catch (error) {
            next(error)
        }
    }

    @Get('/:id/info')
    async findOne(req: Request, res: Response, next: NextFunction) {
        try {
            checkValidId(req.params.id)
            const student = await studentService.getDetailById(Number(req.params.id))

            if (!student) throw new Error('دانشجویی با این اطلاعات یافت نشد')

            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: student
            })
        } catch (error) {
            next(error)
        }
    }

    @Get('/info')
    async getByUserId(req: TAuthenticatedRequestType, res: Response, next: NextFunction) {
        try {
            const student = await studentService.getStudentDetailByUserId(req.user?.id)

            if (!student) throw new Error('دانشجویی با این اطلاعات یافت نشد')

            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: student
            })
        } catch (error) {
            next(error)
        }
    }

    @Get('/available-classes')
    async getAvailableClasses(req: TAuthenticatedRequestType, res: Response, next: NextFunction) {
        try {
            //* 1. get student id from request
            //? 2. list of all courses for current student
            // 3. find all courses that current student is enrolled in
            // 4. remove enrolled courses from list of all courses
            // 5. return list of available classes

            const student = await studentService.getByUserId(req.user?.id)
            if (!student) throw new Error('دانشجویی با این اطلاعات یافت نشد')

            const studentId = student.dataValues.id

            const classes = await studentService.getAvailableClasses(studentId)

            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: classes
            })
        } catch (error) {
            next(error)
        }
    }
}

export default new StudentController()
