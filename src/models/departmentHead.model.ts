import { DataTypes } from 'sequelize'
import { sequelizeConfig } from '../core/config/database.config'
import { UserModel } from './user.model'
import { DepartmentModel } from './department.model'
import { DegreeModel } from './degree.model'
import { APP_ENV } from '../core/config/dotenv.config'
import { StudyModel } from './study.model'

const PROTOCOL = APP_ENV.application.protocol
const HOST = APP_ENV.application.host
const PORT = APP_ENV.application.port

const BASE_URL = `${PROTOCOL}://${HOST}:${PORT}`

const DepartmentHeadModel = sequelizeConfig.define(
    'department_heads',
    {
        department_head_code: { type: DataTypes.STRING(10), allowNull: false },
        department_id: { type: DataTypes.INTEGER, allowNull: false },
        work_experience_years: { type: DataTypes.INTEGER, allowNull: false },
        office_phone: { type: DataTypes.STRING(11), allowNull: true },
        office_address: { type: DataTypes.STRING(255), allowNull: true },
        hire_date: { type: DataTypes.STRING, allowNull: false },
        study_id: { type: DataTypes.INTEGER, allowNull: false },
        responsibilities: { type: DataTypes.TEXT, allowNull: true },
        national_card_image: { type: DataTypes.STRING(255), allowNull: false },
        birth_certificate_image: { type: DataTypes.STRING(255), allowNull: false },
        military_service_image: { type: DataTypes.STRING(255), allowNull: false },
        employment_contract_file: { type: DataTypes.STRING(255), allowNull: true },
        status: { type: DataTypes.ENUM('active', 'inactive', 'retired'), allowNull: false, defaultValue: 'inactive' }
    },
    { timestamps: true, freezeTableName: true }
)

DepartmentHeadModel.belongsTo(UserModel, { foreignKey: 'user_id', onDelete: 'CASCADE' })
DepartmentHeadModel.belongsTo(DepartmentModel, { foreignKey: 'department_id', onDelete: 'CASCADE' })
DepartmentHeadModel.belongsTo(DegreeModel, { foreignKey: 'degree_id', onDelete: 'CASCADE' })
DepartmentHeadModel.belongsTo(StudyModel, { foreignKey: 'study_id', onDelete: 'CASCADE' })

DepartmentHeadModel.addHook('afterFind', (result) => {
    if (!result) return

    const addBaseUrl = (departmentHead: any) => {
        if (!departmentHead || !departmentHead.dataValues) return

        const fileFields = [
            'national_card_image',
            'birth_certificate_image',
            'military_service_image',
            'employment_contract_file'
        ]

        fileFields.forEach((field) => {
            if (departmentHead.dataValues[field]) {
                departmentHead.dataValues[field] = `${BASE_URL}${departmentHead.dataValues[field]}`
            }
        })
    }

    if (Array.isArray(result)) {
        result.forEach(addBaseUrl)
    } else {
        addBaseUrl(result)
    }
})
export { DepartmentHeadModel }
