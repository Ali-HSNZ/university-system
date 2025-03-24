import { DegreeModel } from '../../models/degree.model'
import { DepartmentModel } from '../../models/department.model'
import { UserModel } from '../../models/user.model'
import { Op } from 'sequelize'
import { TCheckExistUserType, TUpdateUserDataType } from './user.types'

const userServices = {
    getAll: async () => {
        const users = await UserModel.findAll({
            attributes: { exclude: ['password', 'createdAt', 'updatedAt', 'degree_id', 'department_id'] },
            include: [
                { model: DegreeModel, attributes: ['id', 'name'] },
                { model: DepartmentModel, attributes: ['id', 'name'] }
            ]
        })
        return users
    },
    count: async () => {
        const usersCount = await UserModel.count()
        return usersCount
    },
    update: async (id: number, data: TUpdateUserDataType) => {
        const user = await UserModel.update(data, { where: { id } })
        return user
    },
    search: async (query: {
        first_name?: string
        last_name?: string
        email?: string
        phone?: string
        national_code?: string
    }) => {
        const queryKeys = ['first_name', 'last_name', 'email', 'phone', 'national_code']

        const whereClause = queryKeys.reduce<Record<string, any>>((acc, key) => {
            const value = query[key as keyof typeof query]?.trim()
            if (value) acc[key] = { [Op.like]: `%${value}%` }
            return acc
        }, {})

        const users = await UserModel.findAll({
            where: {
                [Op.or]: whereClause
            },
            attributes: { exclude: ['password', 'degree_id', 'department_id'] }
        })
        return users
    },
    getById: async (id: number) => {
        const user = await UserModel.findByPk(id, {
            attributes: { exclude: ['password', 'degree_id', 'department_id'] },
            include: [
                { model: DegreeModel, attributes: ['id', 'name'] },
                { model: DepartmentModel, attributes: ['id', 'name'] }
            ]
        })
        return user
    },
    checkExist: async (id: number) => {
        const user = await UserModel.findByPk(id)
        return user
    },
    findOne: async (data: TCheckExistUserType) => {
        if (!data.national_code) return true

        const whereClause = ['national_code', 'phone', 'email'].reduce<Record<string, string>>((acc, key) => {
            const value = data[key as keyof TCheckExistUserType]?.trim()
            if (value) acc[key] = value
            return acc
        }, {})

        const user = await UserModel.findOne({
            where: {
                [Op.or]: whereClause
            }
        })
        return !!user
    },
    delete: async (id: number) => {
        const user = await UserModel.destroy({ where: { id } })
        return user
    }
}

export default userServices
