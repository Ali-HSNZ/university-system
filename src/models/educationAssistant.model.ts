import { DataTypes } from 'sequelize'
import { sequelizeConfig } from '../core/config/database.config'
import { UserModel } from './user.model'
import { DepartmentModel } from './department.model'
import { DegreeModel } from './degree.model'
import { APP_ENV } from '../core/config/dotenv.config'

const PROTOCOL = APP_ENV.application.protocol
const HOST = APP_ENV.application.host
const PORT = APP_ENV.application.port

const BASE_URL = `${PROTOCOL}://${HOST}:${PORT}`

const EducationAssistantModel = sequelizeConfig.define(
    'education_assistants',
    {
        // کد یکتای معاون آموزشی
        education_assistant_code: { type: DataTypes.STRING(10), allowNull: false, unique: true },
        // شناسه گروه آموزشی (مثلاً برق، معماری و ...)
        department_id: { type: DataTypes.INTEGER, allowNull: false },

        // تعداد سال‌های تجربه کاری
        work_experience_years: { type: DataTypes.INTEGER, allowNull: false },
        // شماره تلفن دفتر معاون آموزشی
        office_phone: { type: DataTypes.STRING(11), allowNull: true },
        office_address: { type: DataTypes.STRING(255), allowNull: true },
        // تاریخ استخدام
        hire_date: { type: DataTypes.DATEONLY, allowNull: false },
        // شرح وظایف معاون آموزشی در گروه
        responsibilities: { type: DataTypes.TEXT, allowNull: true },
        // تصویر کارت ملی
        national_card_image: { type: DataTypes.STRING(255), allowNull: false },
        // تصویر شناسنامه
        birth_certificate_image: { type: DataTypes.STRING(255), allowNull: false },
        // تصویر کارت پایان خدمت
        military_service_image: { type: DataTypes.STRING(255), allowNull: false },
        // قرارداد کاری
        employment_contract_file: { type: DataTypes.STRING(255), allowNull: true },
        // وضعیت شغلی
        status: {
            type: DataTypes.ENUM('active', 'inactive', 'retired'),
            allowNull: false,
            defaultValue: 'active'
        }
    },
    { timestamps: true, freezeTableName: true }
)

// ارتباطات بین جداول
EducationAssistantModel.belongsTo(UserModel, { foreignKey: 'user_id', onDelete: 'CASCADE' })
EducationAssistantModel.belongsTo(DepartmentModel, { foreignKey: 'department_id', onDelete: 'CASCADE' })
EducationAssistantModel.belongsTo(DegreeModel, { foreignKey: 'degree_id', onDelete: 'CASCADE' }) // <-- Add this

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
