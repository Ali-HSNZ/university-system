import { DataTypes } from 'sequelize'
import { sequelizeConfig } from '../core/config/database.config'
import { CourseModel } from './course.model'
import { UserModel } from './user.model'
import { SemesterModel } from './semester.model'
import { DepartmentModel } from './department.model'

const ClassModel = sequelizeConfig.define(
    'class',
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        start_time: { type: DataTypes.STRING, allowNull: false },
        end_time: { type: DataTypes.STRING, allowNull: false },
        day: {
            type: DataTypes.ENUM('Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'),
            allowNull: false
        },
        classroom_number: { type: DataTypes.STRING(20), allowNull: false },
        address: { type: DataTypes.STRING, allowNull: true }
    },
    { timestamps: false, freezeTableName: true }
)

ClassModel.belongsTo(CourseModel, { foreignKey: 'course_id', onDelete: 'CASCADE' })
ClassModel.belongsTo(UserModel, { foreignKey: 'professor_id', onDelete: 'CASCADE' })
ClassModel.belongsTo(SemesterModel, { foreignKey: 'semester_id', onDelete: 'CASCADE' })
CourseModel.belongsToMany(DepartmentModel, {
    through: 'departmentCourses',
    foreignKey: 'course_id',
    otherKey: 'department_id'
})

export { ClassModel }
