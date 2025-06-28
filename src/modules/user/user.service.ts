import { UserModel } from '../../models/user.model'
import { Op } from 'sequelize'
import { TFindOneUserType, TUpdateUserPasswordInferType } from './user.types'
import { TBaseUserDataType } from '../auth/auth.types'
import { compareHash, hashString } from '../../core/utils/hash-string'

const userServices = {
    getAll: async () => {
        const users = await UserModel.findAll({
            attributes: { exclude: ['password'] }
        })
        return users.map((user) => ({
            ...user.dataValues,
            gender: user.dataValues.gender === 'male' ? 'مرد' : 'زن'
        }))
    },
    count: async () => {
        const usersCount = await UserModel.count()
        return usersCount
    },
    //
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
    checkExistInUpdate: async (user_id: number, data: TFindOneUserType) => {
        const orConditions = []

        const errors: Record<string, string> = {}

        if (data.national_code?.trim()) {
            orConditions.push({ national_code: data.national_code.trim() })
        }

        if (data.phone?.trim()) {
            orConditions.push({ phone: data.phone.trim() })
        }

        if (data.email?.trim()) {
            orConditions.push({ email: data.email.trim() })
        }

        if (orConditions.length === 0) return false

        if (data?.national_code?.trim()) {
            const existingNationalCodeUser = await UserModel.findOne({
                where: {
                    [Op.and]: [
                        { id: { [Op.ne]: user_id } },
                        { [Op.or]: [{ national_code: data?.national_code?.trim() }] }
                    ]
                }
            })
            if (existingNationalCodeUser) errors.national_code = 'کاربری با این کد ملی قبلا ثبت نام کرده است'
        }

        if (data?.phone?.trim()) {
            const existingPhoneUser = await UserModel.findOne({
                where: {
                    [Op.and]: [{ id: { [Op.ne]: user_id } }, { phone: data?.phone?.trim() }]
                }
            })
            if (existingPhoneUser) errors.phone = 'کاربری با این شماره تلفن قبلا ثبت نام کرده است'
        }

        if (data?.email?.trim()) {
            const existingEmailUser = await UserModel.findOne({
                where: {
                    [Op.and]: [{ id: { [Op.ne]: user_id } }, { email: data?.email?.trim() }]
                }
            })
            if (existingEmailUser) errors.email = 'کاربری با این ایمیل قبلا ثبت نام کرده است'
        }

        if (Object.keys(errors).length > 0) return errors

        return false
    },
    delete: async (id: number) => {
        const user = await UserModel.destroy({ where: { id: Number(id) } })
        return user
    },
    updatePassword: async (id: number, data: TUpdateUserPasswordInferType) => {
        // check current password
        // check new password is not the same as the current password
        // check equal confirm password with password

        const user = await UserModel.findByPk(id)
        if (!user) throw new Error('کاربری با این اطلاعات یافت نشد')

        const isPasswordCorrect = await compareHash(data.current_password, user.dataValues.password)
        if (!isPasswordCorrect) throw new Error('رمز عبور فعلی صحیح نیست')

        if (hashString(data.password!) === user.dataValues.password)
            throw new Error('رمز عبور جدید نمیتواند با رمز عبور فعلی یکسان باشد')

        const hashedPassword = hashString(data.password!)

        await UserModel.update({ password: hashedPassword }, { where: { id } })

        return true
    }
}

export default userServices

