import { DataTypes } from 'sequelize'
import { sequelizeConfig } from '../core/config/database.config'
import { DegreeModel } from './degree.model'
import { DepartmentModel } from './department.model'
import { APP_ENV } from '../core/config/dotenv.config'

const UserModel = sequelizeConfig.define(
    'users',
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        first_name: { type: DataTypes.STRING(100), allowNull: true },
        last_name: { type: DataTypes.STRING(100), allowNull: true },
        gender: {
            type: DataTypes.ENUM('male', 'female'),
            allowNull: false,
            defaultValue: 'male'
        },
        avatar: { type: DataTypes.STRING(255), allowNull: true },
        student_code: { type: DataTypes.STRING(10), allowNull: true },
        phone: { type: DataTypes.STRING(11), allowNull: true },
        professor_code: { type: DataTypes.STRING(10), allowNull: true },
        training_course_code: { type: DataTypes.ENUM('11', '22'), allowNull: true },
        deputy_code: { type: DataTypes.STRING(10), allowNull: true },
        password: { type: DataTypes.STRING(255), allowNull: false },
        national_code_image: { type: DataTypes.STRING(255), allowNull: true },
        military_image: { type: DataTypes.STRING(255), allowNull: true },
        military_status: {
            type: DataTypes.ENUM('active', 'completed', 'exempted', 'postponed'),
            allowNull: true,
            defaultValue: 'active'
        },
        student_status: {
            type: DataTypes.ENUM('active', 'deActive', 'studying', 'active', 'graduate'),
            allowNull: true,
            defaultValue: 'active'
        },
        email: { type: DataTypes.STRING(100), allowNull: true },
        national_code: { type: DataTypes.STRING(10), allowNull: true },
        role: {
            type: DataTypes.ENUM('student', 'professor', 'education_assistant', 'university_president'),
            allowNull: false
        },
        entry_date: { type: DataTypes.STRING, allowNull: true },
        entry_semester: { type: DataTypes.ENUM('1', '2'), allowNull: true }
    },
    { timestamps: true, freezeTableName: true }
)

const PROTOCOL = APP_ENV.application.protocol
const HOST = APP_ENV.application.host
const PORT = APP_ENV.application.port

const BASE_URL = `${PROTOCOL}://${HOST}:${PORT}`

const serializeUserModel = (user: any) => {
    if (user.avatar) user.avatar = BASE_URL + user.avatar
    if (user.national_code_image) user.national_code_image = BASE_URL + user.national_code_image
    if (user.military_image) user.military_image = BASE_URL + user.military_image
    return user
}

UserModel.addHook('afterFind', (result: any) => {
    if (Array.isArray(result)) result.forEach((user) => serializeUserModel(user))
    else if (result) serializeUserModel(result)
})

UserModel.belongsTo(DegreeModel, { foreignKey: 'degree_id', onDelete: 'SET NULL' })
UserModel.belongsTo(DepartmentModel, { foreignKey: 'department_id', onDelete: 'SET NULL' })

export { UserModel }
