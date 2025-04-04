import { DataTypes } from 'sequelize'
import { sequelizeConfig } from '../core/config/database.config'
import { DepartmentModel } from './department.model'

const ImportantDateModel = sequelizeConfig.define(
    'important_dates',
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        type: {
            type: DataTypes.ENUM('course_selection', 'add_drop'),
            allowNull: false
        },
        start_date: { type: DataTypes.DATE, allowNull: false },
        end_date: { type: DataTypes.DATE, allowNull: false },
        entry_year: { type: DataTypes.INTEGER, allowNull: false }
    },
    { timestamps: false, freezeTableName: true }
)

ImportantDateModel.belongsTo(DepartmentModel, { foreignKey: 'department_id', onDelete: 'CASCADE' })

export { ImportantDateModel }
