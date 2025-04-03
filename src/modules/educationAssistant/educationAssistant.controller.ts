import { Request, Response, NextFunction } from 'express'
import { Controller, Get } from '../../decorators/router.decorator'
import educationAssistantServices from './educationAssistant.service'
import httpStatus from 'http-status'

@Controller('/education-assistant')
class EducationAssistantController {
    @Get('/list')
    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const educationAssistants = await educationAssistantServices.list()
            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: educationAssistants
            })
        } catch (error) {
            next(error)
        }
    }
}

export default EducationAssistantController
