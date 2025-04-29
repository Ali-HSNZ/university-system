import { DataTypes } from 'sequelize'
import { sequelizeConfig } from '../core/config/database.config'

const StudyModel = sequelizeConfig.define(
    'study',
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING(100), allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: true }
    },
    { freezeTableName: true, modelName: 'study' }
)

export { StudyModel }
