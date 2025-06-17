import { Op } from 'sequelize'
import { DepartmentModel } from '../../models/department.model'
import { UserModel } from '../../models/user.model'
import { StudentModel } from '../../models/student.model'

const departmentServices = {
    findAll: async () => {
        const departments = await DepartmentModel.findAll({})
        return departments
    },
    getDepartmentNameById: async (id: number) => {
        const department = await DepartmentModel.findByPk(id, { attributes: ['name'] })
        return department
    },
    create: async (name: string) => {
        const department = await DepartmentModel.create({ name: name.trim() })
        return department
    },
    checkExistName: async (name: string) => {
        const department = await DepartmentModel.findOne({ where: { name: name.trim() } })
        return !!department
    },
    checkExistNameInUpdate: async (id: number, name: string) => {
        const department = await DepartmentModel.findOne({ where: { id: { [Op.ne]: id }, name } })
        return !!department
    },
    checkExistId: async (id: string) => {
        const department = await DepartmentModel.findByPk(id)
        return department
    },
    delete: async (id: string) => {
        await DepartmentModel.destroy({ where: { id } })
        return true
    },
    update: async (id: string, name: string) => {
        const department = await DepartmentModel.findByPk(id)
        if (!department) {
            return false
        }
        await department.update({ name: name.trim() })
        return true
    },
    checkUsersInDepartment: async (department_id: string) => {
        const users = await StudentModel.findAll({
            where: { department_id },
            include: [
                {
                    model: UserModel,
                    attributes: ['first_name', 'last_name', 'national_code']
                }
            ]
        })
        return users
    },
    checkExist: async (department_id: number | undefined) => {
        if (!department_id) return false

        const department = await DepartmentModel.findByPk(department_id.toString().trim())
        return !!department
    }
}

export default departmentServices
