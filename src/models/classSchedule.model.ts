import { DataTypes } from 'sequelize'
import { sequelizeConfig } from '../core/config/database.config'
import { ProfessorModel } from './professor.model'
import { ClassModel } from './class.model'

const ClassScheduleModel = sequelizeConfig.define(
    'class_schedule',
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        class_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: ClassModel, key: 'id' } },
        professor_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: ProfessorModel, key: 'id' } },
        day_of_week: { type: DataTypes.ENUM('0', '1', '2', '3', '4', '5', '6'), allowNull: false },
        start_time: { type: DataTypes.TIME, allowNull: false },
        end_time: { type: DataTypes.TIME, allowNull: false },
        session_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 18 }
    },
    { timestamps: false, freezeTableName: true }
)

ClassScheduleModel.belongsTo(ClassModel, { foreignKey: 'class_id', onDelete: 'CASCADE' })
ClassScheduleModel.belongsTo(ProfessorModel, { foreignKey: 'professor_id', onDelete: 'CASCADE' })

export { ClassScheduleModel }
