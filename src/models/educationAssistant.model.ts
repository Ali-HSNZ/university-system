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

const EducationAssistantModel = sequelizeConfig.define(
    'education_assistants',
    {
        education_assistant_code: { type: DataTypes.STRING(10), allowNull: false },
        department_id: { type: DataTypes.INTEGER, allowNull: false },
        work_experience_years: { type: DataTypes.INTEGER, allowNull: false },
        office_phone: { type: DataTypes.STRING(11), allowNull: true },
        study_id: { type: DataTypes.INTEGER, allowNull: false },
        office_address: { type: DataTypes.STRING(255), allowNull: true },
        hire_date: { type: DataTypes.STRING, allowNull: false },
        responsibilities: { type: DataTypes.TEXT, allowNull: true },
        national_card_image: { type: DataTypes.STRING(255), allowNull: false },
        birth_certificate_image: { type: DataTypes.STRING(255), allowNull: false },
        military_service_image: { type: DataTypes.STRING(255), allowNull: false },
        employment_contract_file: { type: DataTypes.STRING(255), allowNull: true },
        status: { type: DataTypes.ENUM('active', 'inactive', 'retired'), allowNull: false, defaultValue: 'active' }
    },
    { timestamps: true, freezeTableName: true }
)

EducationAssistantModel.belongsTo(UserModel, { foreignKey: 'user_id', onDelete: 'CASCADE' })
EducationAssistantModel.belongsTo(DepartmentModel, { foreignKey: 'department_id', onDelete: 'CASCADE' })
EducationAssistantModel.belongsTo(DegreeModel, { foreignKey: 'degree_id', onDelete: 'CASCADE' })
EducationAssistantModel.belongsTo(StudyModel, { foreignKey: 'study_id', onDelete: 'CASCADE' })

EducationAssistantModel.addHook('afterFind', (result) => {
    if (!result) return

    const addBaseUrl = (educationAssistant: any) => {
        if (!educationAssistant || !educationAssistant.dataValues) return

        const fileFields = [
            'national_card_image',
            'birth_certificate_image',
            'military_service_image',
            'employment_contract_file'
        ]

        fileFields.forEach((field) => {
            if (educationAssistant.dataValues[field]) {
                educationAssistant.dataValues[field] = `${BASE_URL}${educationAssistant.dataValues[field]}`
            }
        })
    }

    if (Array.isArray(result)) {
        result.forEach(addBaseUrl)
    } else {
        addBaseUrl(result)
    }
})
export { EducationAssistantModel }
