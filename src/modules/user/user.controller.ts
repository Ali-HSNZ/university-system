import { Request, Response } from 'express'
import { Controller, Get } from '../../decorators/router.decorator'
import userServices from './user.services'
import httpStatus from 'http-status'

@Controller('/users')
class UserController {
    @Get('/')
    async getAllUsers(req: Request, res: Response) {
        const users = await userServices.getAllUsers()
        res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: 'عملیات با موفقیت انجام شد',
            data: users
        })
    }
}

export default new UserController()
