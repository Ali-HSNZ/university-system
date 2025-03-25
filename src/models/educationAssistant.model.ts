import { DataTypes } from 'sequelize'
import { sequelizeConfig } from '../core/config/database.config'
import { UserModel } from './user.model'
import { DepartmentModel } from './department.model'

const EducationAssistantModel = sequelizeConfig.define(
    'education_assistants',
    {
        department_id: { type: DataTypes.INTEGER, allowNull: false },
        start_date: { type: DataTypes.DATEONLY, allowNull: false },
        end_date: { type: DataTypes.DATEONLY, allowNull: true },
        responsibilities: { type: DataTypes.TEXT, allowNull: true },
        access_level: {
            type: DataTypes.ENUM('limited', 'moderate', 'full'),
            allowNull: false,
            defaultValue: 'moderate'
        },
        office_phone: { type: DataTypes.STRING(11), allowNull: true },
        office_address: { type: DataTypes.STRING(255), allowNull: true },
        cv: { type: DataTypes.STRING(255), allowNull: true },
        national_card_image: { type: DataTypes.STRING(255), allowNull: true },
        birth_certificate_image: { type: DataTypes.STRING(255), allowNull: true },
        phd_certificate: { type: DataTypes.STRING(255), allowNull: true },
        managed_departments: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: []
        }
    },
    { timestamps: true, freezeTableName: true }
)

// ارتباطات بین جداول
EducationAssistantModel.belongsTo(UserModel, { foreignKey: 'user_id', onDelete: 'CASCADE' })
EducationAssistantModel.belongsTo(DepartmentModel, { foreignKey: 'department_id', onDelete: 'CASCADE' })

export { EducationAssistantModel }
