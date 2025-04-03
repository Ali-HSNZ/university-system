import { NextFunction, Request, Response } from 'express'
import { Controller, Get } from '../../decorators/router.decorator'
import professorServices from './professor.services'
import httpStatus from 'http-status'

@Controller('/professor')
class ProfessorServices {
    @Get('/list')
    async getProfessors(req: Request, res: Response, next: NextFunction) {
        const professors = await professorServices.list()

        return res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: 'عملیات با موفقیت انجام شد',
            data: professors
        })
    }
}

export default ProfessorServices
