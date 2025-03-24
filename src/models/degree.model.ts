import { DataTypes } from 'sequelize'
import { sequelizeConfig } from '../core/config/database.config'

const DegreeModel = sequelizeConfig.define(
    'degree',
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING(50), allowNull: false }
    },
    { freezeTableName: true, modelName: 'degree' }
)

export { DegreeModel }
