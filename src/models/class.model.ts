import { DataTypes } from 'sequelize'
import { sequelizeConfig } from '../core/config/database.config'
import { CourseModel } from './course.model'
import { UserModel } from './user.model'
import { SemesterModel } from './semester.model'
 
const ClassModel = sequelizeConfig.define(
    'class',
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        course_id: { type: DataTypes.INTEGER, allowNull: false },
        semester_id: { type: DataTypes.INTEGER, allowNull: false },
        professor_id: { type: DataTypes.INTEGER, allowNull: false },
        day_of_week: {
            type: DataTypes.ENUM('Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'),
            allowNull: false
        },
        start_time: { type: DataTypes.TIME, allowNull: false }, // ساعت شروع کلاس
        end_time: { type: DataTypes.TIME, allowNull: false }, // ساعت پایان کلاس
        capacity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 30 } // ظرفیت کلاس
    },
    { timestamps: false, freezeTableName: true }
)

ClassModel.belongsTo(CourseModel, { foreignKey: 'course_id', onDelete: 'CASCADE' })
ClassModel.belongsTo(SemesterModel, { foreignKey: 'semester_id', onDelete: 'CASCADE' })
ClassModel.belongsTo(UserModel, { foreignKey: 'professor_id', onDelete: 'CASCADE' })

export { ClassModel }
