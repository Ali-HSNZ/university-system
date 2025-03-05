import { DataTypes } from 'sequelize'
import { sequelizeConfig } from '../core/config/database.config'

const DepartmentModel = sequelizeConfig.define(
    'department',
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        department_name: { type: DataTypes.STRING(100), allowNull: false }
    },
    { timestamps: false, freezeTableName: true }
)

export { DepartmentModel }
