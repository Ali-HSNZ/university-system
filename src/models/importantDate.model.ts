import { DataTypes } from 'sequelize'
import { sequelizeConfig } from '../core/config/database.config'
import { DepartmentModel } from './department.model'
import { DegreeModel } from './degree.model'
import { StudyModel } from './study.model'

const ImportantDateModel = sequelizeConfig.define(
    'important_date',
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        type: {
            type: DataTypes.ENUM('enrollment', 'add_drop'),
            allowNull: false
        },
        start_date: { type: DataTypes.STRING, allowNull: false },
        end_date: { type: DataTypes.STRING, allowNull: false },
        entry_year: { type: DataTypes.INTEGER, allowNull: false }
    },
    { timestamps: false, freezeTableName: true }
)

ImportantDateModel.belongsTo(DepartmentModel, { foreignKey: 'department_id', onDelete: 'CASCADE' })
ImportantDateModel.belongsTo(DegreeModel, { foreignKey: 'degree_id', onDelete: 'CASCADE' })
ImportantDateModel.belongsTo(StudyModel, { foreignKey: 'study_id', onDelete: 'CASCADE' })

export { ImportantDateModel }
