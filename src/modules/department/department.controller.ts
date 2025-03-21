import { Request, Response } from 'express'
import httpStatus from 'http-status'
import departmentServices from './department.services'
import { Controller, Delete, Get, Post, Put } from '../../decorators/router.decorator'

@Controller('/departments')
class DepartmentController {
    @Get()
    async getAllDepartments(req: Request, res: Response) {
        const departments = await departmentServices.findAll()
        res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: 'عملیات با موفقیت انجام شد',
            data: departments
        })
    }

    @Get('/:id/info')
    async getDepartmentById(req: Request, res: Response) {
        const { id } = req.params
        const department = await departmentServices.checkExistId(id)
        if (!department) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: httpStatus.BAD_REQUEST,
                message: 'گروه آموزشی یافت نشد'
            })
        }
        res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: 'عملیات با موفقیت انجام شد',
            data: department
        })
    }

    @Post('/create')
    async createDepartment(req: Request, res: Response) {
        const { department_name } = req.body
        const existDepartment = await departmentServices.checkExistName(department_name)

        if (existDepartment) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: httpStatus.BAD_REQUEST,
                message: 'این گروه آموزشی قبلا ثبت شده است'
            })
        }
        const department = await departmentServices.create(department_name)
        if (department) {
            res.status(httpStatus.CREATED).json({
                status: httpStatus.CREATED,
                message: 'گروه آموزشی با موفقیت ایجاد شد'
            })
        } else {
            res.status(httpStatus.BAD_REQUEST).json({
                status: httpStatus.BAD_REQUEST,
                message: 'عملیات با مشکل مواجه شد'
            })
        }
    }

    @Put('/:id/update')
    async updateDepartment(req: Request, res: Response) {
        const { id } = req.params
        const { name } = req.body
        const department = await departmentServices.checkExistId(id)
        if (!department) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: httpStatus.NOT_FOUND,
                message: 'گروه آموزشی یافت نشد'
            })
        }
        const existDepartment = await departmentServices.checkExistName(name)
        if (existDepartment) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: httpStatus.BAD_REQUEST,
                message: 'این گروه آموزشی قبلا ثبت شده است'
            })
        }
        const updatedDepartment = await departmentServices.update(id, name)
        if (updatedDepartment) {
            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'گروه آموزشی با موفقیت به روز شد'
            })
        } else {
            res.status(httpStatus.BAD_REQUEST).json({
                status: httpStatus.BAD_REQUEST,
                message: 'عملیات با مشکل مواجه شد'
            })
        }
    }

    @Delete('/:id/delete')
    async deleteDepartment(req: Request, res: Response) {
        const { id } = req.params
        const department = await departmentServices.checkExistId(id)
        if (!department) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: httpStatus.NOT_FOUND,
                message: 'گروه آموزشی یافت نشد'
            })
        }

        // check users in this department
        const users = await departmentServices.checkUsersInDepartment(id)

        if (users.length > 0) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: httpStatus.BAD_REQUEST,
                data: {
                    dependencies: {
                        users: users
                    }
                },
                message: 'کاربرانی در این گروه آموزشی وجود دارند'
            })
        }
        const isDeleted = await departmentServices.delete(id)

        if (isDeleted) {
            res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: 'گروه آموزشی با موفقیت حذف شد'
            })
        } else {
            res.status(httpStatus.BAD_REQUEST).json({
                status: httpStatus.BAD_REQUEST,
                message: 'عملیات با مشکل مواجه شد'
            })
        }
    }
}

export default new DepartmentController()
