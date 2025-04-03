import { Request, Response, NextFunction } from 'express'
import { Controller, Get } from '../../decorators/router.decorator'
import educationAssistantServices from './educationAssistant.services'
import httpStatus from 'http-status'

@Controller('/education-assistant')
class EducationAssistantController {
    @Get('/list')
    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const educationAssistants = await educationAssistantServices.list()
            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                data: educationAssistants,
                message: 'عملیات با موفقیت انجام شد'
            })
        } catch (error) {
            next(error)
        }
    }
}
