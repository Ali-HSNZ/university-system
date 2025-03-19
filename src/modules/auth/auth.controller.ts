import { Request, Response } from 'express'
import { Controller, Post } from '../../decorators/router.decorator'
import registerValidation from './auth.validation'
import { errorHandling } from '../../core/utils/error-handling'
import { validationHandling } from '../../core/utils/validation-handling'
import httpStatus from 'http-status'

@Controller('auth')
class AuthController {
    @Post('/register')
    async register(req: Request, res: Response) {
        try {
            const validatedData = await validationHandling(req.body, registerValidation)
            res.status(httpStatus.OK).json({ data: validatedData })
        } catch (error) {
            errorHandling(error, res)
        }
    }
}

export default new AuthController()
