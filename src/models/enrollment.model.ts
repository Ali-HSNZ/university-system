import { DataTypes } from 'sequelize'
import { sequelizeConfig } from '../core/config/database.config'
import { UserModel } from './user.model'
import { ClassModel } from './class.model'

const EnrollmentModel = sequelizeConfig.define(
    'enrollment',
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        status: {
            type: DataTypes.ENUM('pending', 'approved', 'rejected'),
            defaultValue: 'pending'
        }
    },
    { timestamps: false, freezeTableName: true }
)

EnrollmentModel.belongsTo(UserModel, { foreignKey: 'student_id', onDelete: 'CASCADE' })
EnrollmentModel.belongsTo(ClassModel, { foreignKey: 'class_id', onDelete: 'CASCADE' })

export { EnrollmentModel }
