import { Request, Response, NextFunction } from 'express'
import { Controller, Get } from '../../decorators/router.decorator'
import departmentHeadService from './departmentHead.service'
import httpStatus from 'http-status'

@Controller('/department-head')
class DepartmentHeadController {
    @Get('/list')
    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const departmentHeads = await departmentHeadService.list()
            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'عملیات با موفقیت انجام شد',
                data: departmentHeads
            })
        } catch (error) {
            next(error)
        }
    }
}

export default DepartmentHeadController
