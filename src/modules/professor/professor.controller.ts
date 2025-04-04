import { NextFunction, Request, Response } from 'express'
import { Controller, Get } from '../../decorators/router.decorator'
import professorService from './professor.service'
import httpStatus from 'http-status'

@Controller('/professor')
class ProfessorController {
    @Get('/list')
    async getProfessors(req: Request, res: Response, next: NextFunction) {
        const professors = await professorService.list()

        return res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: 'عملیات با موفقیت انجام شد',
            data: professors
        })
    }
}

export default ProfessorController
