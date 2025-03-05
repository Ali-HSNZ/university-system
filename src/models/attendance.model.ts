import { DataTypes } from 'sequelize'
import { sequelizeConfig } from '../core/config/database.config'
import { EnrollmentModel } from './enrollment.model'

const AttendanceModel = sequelizeConfig.define(
    'attendance',
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        session_number: { type: DataTypes.INTEGER, allowNull: false },
        presence: { type: DataTypes.BOOLEAN, allowNull: false }
    },
    { timestamps: false, freezeTableName: true }
)

AttendanceModel.belongsTo(EnrollmentModel, { foreignKey: 'enrollment_id', onDelete: 'CASCADE' })

export { AttendanceModel }
