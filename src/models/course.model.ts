import { DataTypes } from 'sequelize'
import { sequelizeConfig } from '../core/config/database.config'

const CourseModel = sequelizeConfig.define(
    'course',
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING(100), allowNull: false },
        code: { type: DataTypes.STRING(20), allowNull: false, unique: true },
        theory_unit: { type: DataTypes.INTEGER, allowNull: false },
        practical_unit: { type: DataTypes.INTEGER, allowNull: false }
    },
    { timestamps: false, freezeTableName: true }
)

export { CourseModel }
