import { DataTypes } from 'sequelize'
import { sequelizeConfig } from '../core/config/database.config'
import { UserModel } from './user.model'
import { DepartmentModel } from './department.model'

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
        cv: { type: DataTypes.STRING(255), allowNull: true },
        national_card_image: { type: DataTypes.STRING(255), allowNull: true },
        birth_certificate_image: { type: DataTypes.STRING(255), allowNull: true },
        military_service_image: { type: DataTypes.STRING(255), allowNull: true },
        phd_certificate: { type: DataTypes.STRING(255), allowNull: true }
    },
    { timestamps: true, freezeTableName: true }
)

ProfessorModel.belongsTo(UserModel, { foreignKey: 'user_id', onDelete: 'CASCADE' })
ProfessorModel.belongsTo(DepartmentModel, { foreignKey: 'department_id', onDelete: 'CASCADE' })

export { ProfessorModel }
