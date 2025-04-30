import { DepartmentModel } from '../../models/department.model'
import { UserModel } from '../../models/user.model'

const departmentServices = {
    findAll: async () => {
        const departments = await DepartmentModel.findAll({
            attributes: ['id', 'name']
        })
        return departments
    },
    create: async (name: string) => {
        const department = await DepartmentModel.create({ name: name.trim() })
        return department
    },
    checkExistName: async (name: string) => {
        const department = await DepartmentModel.findOne({ where: { name: name.trim() } })
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
    checkUsersInDepartment: async (id: string) => {
        const users = await UserModel.findAll({
            where: { department_id: id },
            attributes: ['id', 'username', 'full_name', 'role']
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
