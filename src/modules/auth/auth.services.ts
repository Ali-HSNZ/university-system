import { DegreeModel } from '../../models/degree.model'
import { DepartmentModel } from '../../models/department.model'
import { UserModel } from '../../models/user.model'
import { TCheckExistUserType, TRegisterDataType } from './auth.types'
import { Op } from 'sequelize'

const authServices = {
    checkExistUser: async (data: TCheckExistUserType) => {
        if (!data.national_code) return true

        const whereClause: Record<string, string> = {}

        if (data.national_code?.trim()) whereClause.national_code = data.national_code.trim()
        if (data.phone) whereClause.phone = data.phone
        if (data.email) whereClause.email = data.email

        const user = await UserModel.findOne({
            where: {
                [Op.or]: whereClause
            }
        })
        return !!user
    },

    checkExistDegree: async (degree_id: string | undefined) => {
        if (!degree_id) return false

        const degree = await DegreeModel.findByPk(degree_id.toString().trim())
        return !!degree
    },
    checkExistDepartment: async (department_id: string | undefined) => {
        if (!department_id) return false

        const department = await DepartmentModel.findByPk(department_id.toString().trim())
        return !!department
    },
    create: async (data: TRegisterDataType) => {
        const user = await UserModel.create(data)
        return user
    }
}

export default authServices
