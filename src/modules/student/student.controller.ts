import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import studentService from './student.service'
import { Controller, Get } from '../../decorators/router.decorator'

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
}

export default new StudentController()
