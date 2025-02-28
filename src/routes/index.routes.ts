import { Router } from 'express'

import DecoratorRouter from '../decorators/router.decorator'

const router: Router = Router()

router.use(DecoratorRouter)

export default router
