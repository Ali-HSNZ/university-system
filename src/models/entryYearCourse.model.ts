import { DataTypes } from 'sequelize'
import { sequelizeConfig } from '../core/config/database.config'
import { CourseModel } from './course.model'
import { EntryYearModel } from './entryYear.model'

const EntryYearCourseModel = sequelizeConfig.define(
    'entry_year_course',
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        entry_year_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: EntryYearModel, key: 'id' },
            onDelete: 'CASCADE'
        },
        course_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: CourseModel, key: 'id' },
            onDelete: 'CASCADE'
        }
    },
    { timestamps: false, freezeTableName: true }
)

// Set up the associations
EntryYearCourseModel.belongsTo(EntryYearModel, { foreignKey: 'entry_year_id' })
EntryYearCourseModel.belongsTo(CourseModel, { foreignKey: 'course_id' })

export { EntryYearCourseModel }
