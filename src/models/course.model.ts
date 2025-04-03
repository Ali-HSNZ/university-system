import { DataTypes } from 'sequelize'
import { sequelizeConfig } from '../core/config/database.config'
import { DepartmentModel } from './department.model'

const CourseModel = sequelizeConfig.define(
    'course',
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING(255), allowNull: false },
        code: { type: DataTypes.STRING(20), allowNull: false },
        theoretical_units: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        practical_units: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        total_units: {
            type: DataTypes.VIRTUAL,
            get() {
                return Number(this.dataValues.theoretical_units) + Number(this.dataValues.practical_units)
            }
        },
        department_id: { type: DataTypes.INTEGER, allowNull: false },
        type: { type: DataTypes.ENUM('theory', 'practical', 'combined'), allowNull: false },
        prerequisites: { type: DataTypes.JSON, allowNull: true },
        corequisites: { type: DataTypes.JSON, allowNull: true }
    },
    { timestamps: false, freezeTableName: true }
)

CourseModel.belongsTo(DepartmentModel, { foreignKey: 'department_id', onDelete: 'CASCADE' })

CourseModel.addHook('afterFind', (result) => {
    if (!result) return

    const addBaseUrl = (course: any) => {
        if (!course || !course.dataValues) return

        const fileFields = ['prerequisites', 'corequisites']

        fileFields.forEach((field) => {
            if (course.dataValues[field]) {
                course.dataValues[field] = JSON.parse(course.dataValues[field])
            }
        })
    }

    if (Array.isArray(result)) result.forEach(addBaseUrl)
    else addBaseUrl(result)
})
export { CourseModel }
