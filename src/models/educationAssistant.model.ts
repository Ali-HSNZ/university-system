import { DataTypes } from 'sequelize'
import { sequelizeConfig } from '../core/config/database.config'
import { UserModel } from './user.model'
import { DepartmentModel } from './department.model'
import { DegreeModel } from './degree.model'

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

export { EducationAssistantModel }
