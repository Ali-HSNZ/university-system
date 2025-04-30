import { DataTypes } from 'sequelize'
import { sequelizeConfig } from '../core/config/database.config'
import { DegreeModel } from './degree.model'
import { DepartmentModel } from './department.model'
import { StudyModel } from './study.model'
import { CourseModel } from './course.model'

const EntryYearModel = sequelizeConfig.define(
    'entry_year',
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        year: { type: DataTypes.STRING, allowNull: false }
    },
    { timestamps: false, freezeTableName: true }
)

EntryYearModel.belongsTo(DegreeModel, { foreignKey: 'degree_id', onDelete: 'CASCADE' })
EntryYearModel.belongsTo(StudyModel, { foreignKey: 'study_id', onDelete: 'CASCADE' })
EntryYearModel.belongsTo(DepartmentModel, { foreignKey: 'department_id', onDelete: 'CASCADE' })

// Set up the many-to-many relationship with CourseModel
EntryYearModel.belongsToMany(CourseModel, {
    through: 'entry_year_course',
    foreignKey: 'entry_year_id',
    otherKey: 'course_id',
    as: 'courses'
})

CourseModel.belongsToMany(EntryYearModel, {
    through: 'entry_year_course',
    foreignKey: 'course_id',
    otherKey: 'entry_year_id',
    as: 'entryYears'
})

export { EntryYearModel }
