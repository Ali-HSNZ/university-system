import { Request, Response, NextFunction } from 'express'
import { Controller, Delete, Get, Post } from '../../decorators/router.decorator'
import httpStatus from 'http-status'
import classProfessorService from './classProfessor.service'
import { validationHandling } from '../../core/utils/validation-handling'
import classProfessorSchema from './classProfessor.validation'
import classService from '../class/class.service'
import professorService from '../professor/professor.service'
import { checkValidId } from '../../core/utils/check-valid-id'

@Controller('/class-professor')
class ClassProfessorController {
    @Get('/list')
    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const classProfessors = await classProfessorService.list()

            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: classProfessors
            })
        } catch (error) {
            next(error)
        }
    }

    @Get('/:id/info')
    async info(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            checkValidId(id)

            const classProfessor = await classProfessorService.info(Number(id))

            if (!classProfessor) throw new Error('اطلاعات استاد در کلاس یافت نشد')

            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: classProfessor
            })
        } catch (error) {
            next(error)
        }
    }

    @Post('/create')
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            await validationHandling(req.body, classProfessorSchema)

            const existClass = await classService.checkExist(req.body.class_id)
            if (!existClass) throw new Error('کلاس مورد نظر یافت نشد')

            const existProfessor = await professorService.checkExist(req.body.professor_id)
            if (!existProfessor) throw new Error('استاد مورد نظر یافت نشد')

            const existClassProfessor = await classProfessorService.checkExist(req.body.class_id, req.body.professor_id)
            if (existClassProfessor) throw new Error('استاد قبلا در این کلاس ثبت شده است')

            await classProfessorService.create(req.body)

            return res.status(httpStatus.CREATED).json({
                status: httpStatus.CREATED,
                message: 'عملیات با موفقیت انجام شد'
            })
        } catch (error) {
            next(error)
        }
    }

    @Delete('/:id/delete')
    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            checkValidId(id)

            const deletedClassProfessor = await classProfessorService.delete(Number(id))
            if (!deletedClassProfessor) throw new Error('اطلاعات استاد در کلاس یافت نشد')

            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد'
            })
        } catch (error) {
            next(error)
        }
    }
}

export default ClassProfessorController
