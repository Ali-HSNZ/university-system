import { Request, Response, NextFunction } from 'express'
import { Controller, Get } from '../../decorators/router.decorator'
import professorPanelService from './professor-panel.service'
import httpStatus from 'http-status'
import professorService from '../professor/professor.service'
import { TAuthenticatedRequestType } from '../../core/types/auth'

@Controller('/professor-panel')
export class ProfessorPanelController {
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
}
