import { DataTypes } from 'sequelize'
import { sequelizeConfig } from '../core/config/database.config'
import { DegreeModel } from './degree.model'
import { CourseModel } from './course.model'

const EntryYearCourseModel = sequelizeConfig.define(
    'entry_year_course',
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        year: { type: DataTypes.STRING, allowNull: false }
    },
    { timestamps: false, freezeTableName: true }
)

EntryYearCourseModel.belongsTo(DegreeModel, { foreignKey: 'degree_id', onDelete: 'CASCADE' })
EntryYearCourseModel.belongsTo(CourseModel, { foreignKey: 'course_id', onDelete: 'CASCADE' })

export { EntryYearCourseModel }
