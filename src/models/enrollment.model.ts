import { DataTypes } from 'sequelize'
import { sequelizeConfig } from '../core/config/database.config'
import { ClassScheduleModel } from './classSchedule.model'
import { StudentModel } from './student.model'
import { EnrollmentStatusModel } from './enrollmentStatus.model'

const EnrollmentModel = sequelizeConfig.define(
    'enrollment',
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: StudentModel,
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
        status_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: EnrollmentStatusModel,
                key: 'id'
            }
        }
    },
    { timestamps: true, freezeTableName: true }
)

// Define associations
EnrollmentModel.belongsTo(StudentModel, { foreignKey: 'student_id', onDelete: 'CASCADE' })
EnrollmentModel.belongsTo(ClassScheduleModel, { foreignKey: 'class_schedule_id', onDelete: 'CASCADE' })
EnrollmentModel.belongsTo(EnrollmentStatusModel, { foreignKey: 'status_id', })

export { EnrollmentModel }
