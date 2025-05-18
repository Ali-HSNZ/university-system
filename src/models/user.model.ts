import { DataTypes } from 'sequelize'
import { sequelizeConfig } from '../core/config/database.config'
import { APP_ENV } from '../core/config/dotenv.config'

const UserModel = sequelizeConfig.define(
    'users',
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        first_name: { type: DataTypes.STRING(100), allowNull: false },
        last_name: { type: DataTypes.STRING(100), allowNull: false },
        national_code: {
            type: DataTypes.STRING(10),
            allowNull: false,
            validate: { isNumeric: true, len: [10, 10] }
        },
        gender: { type: DataTypes.ENUM('male', 'female'), allowNull: false },
        birth_date: { type: DataTypes.STRING, allowNull: false },
        phone: { type: DataTypes.STRING(11), allowNull: true },
        email: { type: DataTypes.STRING(100), allowNull: true },
        address: { type: DataTypes.STRING(255), allowNull: true },
        role: {
            type: DataTypes.ENUM(
                'student', // دانشجو
                'professor', // استاد
                'education_assistant', // معاون آموزشی
                'department_head', // مدیر گروه
                'university_president' // رئیس دانشگاه
            ),
            allowNull: false
        },
        password: { type: DataTypes.STRING(255), allowNull: false },
        avatar: { type: DataTypes.STRING(255), allowNull: true },
        is_deleted: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
        deleted_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: { model: 'users', key: 'id' },
            onDelete: 'SET NULL'
        }
    },
    {
        timestamps: true,
        freezeTableName: true,
        paranoid: true,
        deletedAt: 'deleted_at',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        defaultScope: {
            attributes: { exclude: ['created_at', 'updated_at'] }
        }
    }
)

const PROTOCOL = APP_ENV.application.protocol
const HOST = APP_ENV.application.host
const PORT = APP_ENV.application.port

const BASE_URL = `${PROTOCOL}://${HOST}:${PORT}`

const serializeUserModel = (user: any) => {
    if (user.avatar) user.avatar = BASE_URL + user.avatar
    return user
}

// i want to get user with "user_id" in "students" table

UserModel.addHook('afterFind', (result: any) => {
    if (Array.isArray(result)) result.forEach((user) => serializeUserModel(user))
    else if (result) serializeUserModel(result)
})

export { UserModel }
