import { DataTypes } from 'sequelize'
import { sequelizeConfig } from '../core/config/database.config'
import { UserModel } from './user.model'
import { DepartmentModel } from './department.model'
import { DegreeModel } from './degree.model'
import { APP_ENV } from '../core/config/dotenv.config'

const protocol = APP_ENV.application.protocol
const host = APP_ENV.application.host
const port = APP_ENV.application.port

const BASE_URL = `${protocol}://${host}:${port}`

const ProfessorModel = sequelizeConfig.define(
    'professors',
    {
        professor_code: { type: DataTypes.STRING(10), allowNull: false },
        department_id: { type: DataTypes.INTEGER, allowNull: false },
        academic_rank: {
            type: DataTypes.ENUM('instructor', 'assistant_professor', 'associate_professor', 'professor'),
            allowNull: false
        },
        hire_date: { type: DataTypes.DATEONLY, allowNull: false },
        specialization: { type: DataTypes.STRING(255), allowNull: true },
        office_phone: { type: DataTypes.STRING(11), allowNull: true },
        office_address: { type: DataTypes.STRING(255), allowNull: true },
        degree_id: { type: DataTypes.INTEGER, allowNull: true },
        cv_file: { type: DataTypes.STRING(255), allowNull: true },
        national_card_file: { type: DataTypes.STRING(255), allowNull: true },
        birth_certificate_file: { type: DataTypes.STRING(255), allowNull: true },
        military_service_file: { type: DataTypes.STRING(255), allowNull: true },
        phd_certificate_file: { type: DataTypes.STRING(255), allowNull: true },
        work_experience_years: { type: DataTypes.INTEGER, allowNull: true },
        status: { type: DataTypes.ENUM('active', 'inactive', 'retired'), allowNull: false, defaultValue: 'active' },
        research_interests: { type: DataTypes.JSON, allowNull: true },
        employment_contract_file: { type: DataTypes.STRING(255), allowNull: true }
    },
    { timestamps: true, freezeTableName: true }
)

ProfessorModel.belongsTo(UserModel, { foreignKey: 'user_id', onDelete: 'CASCADE' })
ProfessorModel.belongsTo(DepartmentModel, { foreignKey: 'department_id', onDelete: 'CASCADE' })
ProfessorModel.belongsTo(DegreeModel, { foreignKey: 'degree_id', onDelete: 'CASCADE' })

ProfessorModel.addHook('afterFind', (result) => {
    if (!result) return

    const addBaseUrl = (professor: any) => {
        if (!professor || !professor.dataValues) return

        const fileFields = [
            'cv_file',
            'national_card_file',
            'birth_certificate_file',
            'military_service_file',
            'phd_certificate_file',
            'employment_contract_file'
        ]

        fileFields.forEach((field) => {
            if (professor.dataValues[field]) {
                professor.dataValues[field] = `${BASE_URL}${professor.dataValues[field]}`
            }
        })
    }

    if (Array.isArray(result)) {
        result.forEach(addBaseUrl)
    } else {
        addBaseUrl(result)
    }
})

export { ProfessorModel }
