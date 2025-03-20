import { DegreeModel } from '../../models/degree.model'
import { DepartmentModel } from '../../models/department.model'
import { UserModel } from '../../models/user.model'

const userServices = {
    getAllUsers: async () => {
        const users = await UserModel.findAll({
            attributes: ['id', 'username', 'role', 'full_name', 'email', 'national_id'],
            include: [
                { model: DegreeModel, attributes: ['id', 'degree_name'] },
                { model: DepartmentModel, attributes: ['id', 'department_name'] }
            ]
        })
        return users
    }
}

export default userServices
