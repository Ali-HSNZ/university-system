import { DataTypes } from 'sequelize'
import { sequelizeConfig } from '../core/config/database.config'
import { CourseModel } from './course.model'

const ClassModel = sequelizeConfig.define(
    'class',
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        course_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: CourseModel,
                key: 'id'
            }
        },
        enrolled_students: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        status: {
            type: DataTypes.ENUM('open', 'closed', 'canceled'),
            allowNull: false,
            defaultValue: 'open'
        }
    },
    { timestamps: false, freezeTableName: true }
)

ClassModel.belongsTo(CourseModel, { foreignKey: 'course_id', onDelete: 'CASCADE' })

export { ClassModel }

