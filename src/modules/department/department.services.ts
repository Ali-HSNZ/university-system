import { DepartmentModel } from '../../models/department.model'
import { UserModel } from '../../models/user.model'

const departmentServices = {
    findAll: async () => {
        const departments = await DepartmentModel.findAll({
            attributes: ['id', 'department_name']
        })
        return departments
    },
    create: async (department_name: string) => {
        const department = await DepartmentModel.create({ department_name })
        return department
    },
    checkExistName: async (department_name: string) => {
        const department = await DepartmentModel.findOne({ where: { department_name } })
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
        await department.update({ department_name: name })
        return true
    },
    checkUsersInDepartment: async (id: string) => {
        const users = await UserModel.findAll({
            where: { department_id: id },
            attributes: ['id', 'username', 'full_name', 'role']
        })
        return users
    }
}

export default departmentServices
