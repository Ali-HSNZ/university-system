import { DataTypes } from 'sequelize'
import { sequelizeConfig } from '../core/config/database.config'
import { SemesterModel } from './semester.model'

const ImportantDatesModel = sequelizeConfig.define(
    'important_date',
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        semester_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: SemesterModel, key: 'id' },
            onDelete: 'CASCADE'
        },
        start_date: { type: DataTypes.DATEONLY, allowNull: false },
        end_date: { type: DataTypes.DATEONLY, allowNull: false }
    },
    { timestamps: false, freezeTableName: true }
)

ImportantDatesModel.belongsTo(SemesterModel, { foreignKey: 'semester_id', onDelete: 'CASCADE' })

export { ImportantDatesModel }
