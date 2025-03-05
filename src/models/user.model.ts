import { DataTypes } from 'sequelize'
import { sequelizeConfig } from '../core/config/database.config'
import { DegreeModel } from './degree.model'
import { DepartmentModel } from './department.model'

const UserModel = sequelizeConfig.define(
    'users',
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
        password_hash: { type: DataTypes.STRING(255), allowNull: false },
        email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
        full_name: { type: DataTypes.STRING(100), allowNull: false },
        role: {
            type: DataTypes.ENUM('student', 'professor', 'education_assistant', 'university_president'),
            allowNull: false
        },
        entry_year: { type: DataTypes.STRING, allowNull: true }
    },
    { timestamps: true, freezeTableName: true }
)

UserModel.belongsTo(DegreeModel, { foreignKey: 'degree_id', onDelete: 'SET NULL' })
UserModel.belongsTo(DepartmentModel, { foreignKey: 'department_id', onDelete: 'SET NULL' })

export { UserModel }
