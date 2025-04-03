import { NextFunction, Request, Response } from 'express'
import { Controller, Get } from '../../decorators/router.decorator'
import universityPresidentServices from './universityPresident.services'
import httpStatus from 'http-status'

@Controller('/university-president')
class UniversityPresidentController {
    @Get('/list')
    async getUniversityPresidents(req: Request, res: Response, next: NextFunction) {
        try {
            const universityPresidents = await universityPresidentServices.list()
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
