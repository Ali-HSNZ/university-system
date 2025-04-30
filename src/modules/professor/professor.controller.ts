import { NextFunction, Request, Response } from 'express'
import { Controller, Delete, Get } from '../../decorators/router.decorator'
import professorService from './professor.service'
import httpStatus from 'http-status'
import { checkValidId } from '../../core/utils/check-valid-id'

@Controller('/professor')
class ProfessorController {
    @Get('/list')
    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const professors = await professorService.list()

            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: professors
            })
        } catch (error) {
            next(error)
        }
    }

    @Delete('/:id/delete')
    async deleteProfessor(req: Request, res: Response, next: NextFunction) {
        try {
            const professorId = req.params.id
            checkValidId(professorId)

            const existProfessor = await professorService.checkExist(Number(professorId))

            if (!existProfessor) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: httpStatus.NOT_FOUND,
                    message: 'استادی با این شناسه یافت نشد'
                })
            }

            await professorService.delete(Number(professorId))

            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد'
            })
        } catch (error) {
            next(error)
        }
    }
}

export default ProfessorController
