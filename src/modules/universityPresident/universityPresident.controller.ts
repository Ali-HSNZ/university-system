import { NextFunction, Request, Response } from 'express'
import { Controller, Get } from '../../decorators/router.decorator'
import universityPresidentService from './universityPresident.service'
import httpStatus from 'http-status'

@Controller('/university-president')
class UniversityPresidentController {
    @Get('/list')
    async getUniversityPresidents(req: Request, res: Response, next: NextFunction) {
        try {
            const universityPresidents = await universityPresidentService.list()
            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: universityPresidents
            })
        } catch (error) {
            next(error)
        }
    }
}

export default UniversityPresidentController
