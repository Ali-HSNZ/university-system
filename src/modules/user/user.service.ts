import { UserModel } from '../../models/user.model'
import { Op } from 'sequelize'
import { TFindOneUserType } from './user.types'
import { TBaseUserDataType } from '../auth/auth.types'

const userServices = {
    getAll: async () => {
        const users = await UserModel.findAll({
            attributes: { exclude: ['password'] }
        })
        return users
    },
    count: async () => {
        const usersCount = await UserModel.count()
        return usersCount
    },
    update: async (id: number, data: TBaseUserDataType) => {
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
            attributes: { exclude: ['password'] }
        })
        return {
            ...user?.dataValues,
            birth_date: user?.dataValues.birth_date.replaceAll('-', '/')
        }
    },
    checkExistById: async (id: number) => {
        const user = await UserModel.findByPk(id)
        return user
    },
    checkExistByNationalCode: async (national_code: string) => {
        const user = await UserModel.findOne({ where: { national_code } })
        return user
    },
    findOne: async (data: TFindOneUserType) => {
        if (!data.national_code) return true

        const whereClause = ['national_code', 'phone', 'email'].reduce<Record<string, string>>((acc, key) => {
            const value = data[key as keyof TFindOneUserType]?.trim()
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

