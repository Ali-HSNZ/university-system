import { DegreeModel } from '../../models/degree.model'
import { DepartmentModel } from '../../models/department.model'
import { UserModel } from '../../models/user.model'

const userServices = {
    getAllUsers: async () => {
        const users = await UserModel.findAll({
            include: [
                { model: DegreeModel, attributes: ['id', 'degree_name'] },
                { model: DepartmentModel, attributes: ['id', 'department_name'] }
            ]
        })
        return users
    },
    getUsersCount: async () => {
        const usersCount = await UserModel.count()
        return usersCount
    }
}

export default userServices
