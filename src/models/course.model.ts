import { DataTypes } from 'sequelize'
import { sequelizeConfig } from '../core/config/database.config'

const CourseModel = sequelizeConfig.define(
    'course',
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        course_name: { type: DataTypes.STRING(100), allowNull: false },
        course_code: { type: DataTypes.STRING(20), allowNull: false, unique: true },
        theory_units: { type: DataTypes.INTEGER, allowNull: false },
        practical_units: { type: DataTypes.INTEGER, allowNull: false }
    },
    { timestamps: false, freezeTableName: true }
)

export { CourseModel }
