import { Request, Response } from 'express'
import { Controller, Get } from '../../decorators/router.decorator'

@Controller('users')
class UserController {
    @Get('/register')
    async register(req: Request, res: Response) {
        res.status(200).json({ message: 'hello' })
    }
}

export default new UserController()
