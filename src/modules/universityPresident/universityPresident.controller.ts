import { NextFunction, Request, Response } from 'express'
import { Controller, Get } from '../../decorators/router.decorator'
import universityPresidentService from './universityPresident.service'
import httpStatus from 'http-status'
import { TAuthenticatedRequestType } from '../../core/types/auth'

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
    @Get('/profile')
    async getUniversityPresidentProfile(req: TAuthenticatedRequestType, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new Error('User not found')
            }

            const existPresident = await universityPresidentService.checkExistByUserId(req.user.id)
            if (!existPresident) {
                return res.status(httpStatus.NOT_FOUND).json({
                    status: httpStatus.NOT_FOUND,
                    message: 'کاربری با این مشخصات یافت نشد'
                })
            }

            const universityPresident = await universityPresidentService.profile(req.user.id)
            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: universityPresident
            })
        } catch (error) {
            next(error)
        }
    }
}

export default UniversityPresidentController
