import { DataTypes } from 'sequelize'
import { sequelizeConfig } from '../core/config/database.config'
import { UserModel } from './user.model' // دانشجویان
import { ClassScheduleModel } from './classSchedule.model'

const EnrollmentModel = sequelizeConfig.define(
    'enrollment',
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: UserModel,
                key: 'id'
            }
        },
        class_schedule_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: ClassScheduleModel,
                key: 'id'
            }
        },
        status: {
            type: DataTypes.ENUM('pending', 'approved', 'rejected'),
            allowNull: false,
            defaultValue: 'pending'
        }
    },
    {
        timestamps: false,
        freezeTableName: true
    }
)

// Define associations
EnrollmentModel.belongsTo(UserModel, { foreignKey: 'student_id', onDelete: 'CASCADE' })
EnrollmentModel.belongsTo(ClassScheduleModel, { foreignKey: 'class_schedule_id', onDelete: 'CASCADE' })

export { EnrollmentModel }
