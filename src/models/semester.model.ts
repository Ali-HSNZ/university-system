import { DataTypes } from 'sequelize'
import { sequelizeConfig } from '../core/config/database.config'

const SemesterModel = sequelizeConfig.define(
    'semester',
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        year: { type: DataTypes.STRING, allowNull: false },
        term: { type: DataTypes.STRING, allowNull: false }
    },
    { timestamps: false, freezeTableName: true }
)

export { SemesterModel }
