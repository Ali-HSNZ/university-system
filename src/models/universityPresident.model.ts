import { DataTypes } from 'sequelize'

import { sequelizeConfig } from '../core/config/database.config'
import { UserModel } from './user.model'
import { APP_ENV } from '../core/config/dotenv.config'

const PROTOCOL = APP_ENV.application.protocol
const HOST = APP_ENV.application.host
const PORT = APP_ENV.application.port

const BASE_URL = `${PROTOCOL}://${HOST}:${PORT}`

const UniversityPresidentModel = sequelizeConfig.define('UniversityPresident', {
    president_code: { type: DataTypes.STRING(10), allowNull: false, unique: true },
    work_experience_years: { type: DataTypes.INTEGER, allowNull: false },
    office_phone: { type: DataTypes.STRING(11), allowNull: true },
    office_address: { type: DataTypes.STRING(255), allowNull: true },
    hire_date: { type: DataTypes.DATEONLY, allowNull: false },
    responsibilities: { type: DataTypes.TEXT, allowNull: true },
    national_card_image: { type: DataTypes.STRING(255), allowNull: true },
    birth_certificate_image: { type: DataTypes.STRING(255), allowNull: true },
    military_service_image: { type: DataTypes.STRING(255), allowNull: true },
    phd_certificate: { type: DataTypes.STRING(255), allowNull: true },
    employment_contract: { type: DataTypes.STRING(255), allowNull: true }
})

UniversityPresidentModel.belongsTo(UserModel, { foreignKey: 'user_id', onDelete: 'CASCADE' })

UniversityPresidentModel.addHook('afterFind', (result) => {
    if (!result) return

    const addBaseUrl = (professor: any) => {
        if (!professor || !professor.dataValues) return

        const fileFields = [
            'national_card_image',
            'birth_certificate_image',
            'military_service_image',
            'phd_certificate',
            'employment_contract'
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

export { UniversityPresidentModel }
