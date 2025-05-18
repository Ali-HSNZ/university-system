import { DataTypes } from 'sequelize'
import { sequelizeConfig } from '../core/config/database.config'
import { ClassScheduleModel } from './classSchedule.model'
import { StudentModel } from './student.model'

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
        status: {
            type: DataTypes.ENUM(
                'pending_department_head', // در انتظار تایید مدیر گروه
                'pending_education_assistant', // در انتظار تایید معاون آموزشی
                'approved_by_department_head', // تایید شده توسط مدیر گروه
                'approved_by_education_assistant', // تایید شده توسط معاون آموزشی
                'rejected_by_department_head', // رد شده توسط مدیر گروه
                'rejected_by_education_assistant', // رد شده توسط معاون آموزشی
                'final_approved', // تایید نهایی
                'final_rejected' // رد نهایی
            ),
            allowNull: true,
            defaultValue: 'pending_department_head'
        },
        department_head_id: { type: DataTypes.INTEGER, allowNull: true, comment: 'شناسه مدیر گروه' },
        education_assistant_id: { type: DataTypes.INTEGER, allowNull: true, comment: 'شناسه معاون آموزشی' },

        department_head_comment: { type: DataTypes.TEXT, allowNull: true, comment: 'توضیحات مدیر گروه' },
        education_assistant_comment: { type: DataTypes.TEXT, allowNull: true, comment: 'توضیحات معاون آموزشی' },

        department_head_approval_date: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'تاریخ تایید/رد توسط مدیر گروه'
        },
        education_assistant_approval_date: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'تاریخ تایید/رد توسط معاون آموزشی'
        }
    },
    {
        timestamps: true,
        freezeTableName: true
    }
)

// Define associations
EnrollmentModel.belongsTo(StudentModel, { foreignKey: 'student_id', onDelete: 'CASCADE' })
EnrollmentModel.belongsTo(ClassScheduleModel, { foreignKey: 'class_schedule_id', onDelete: 'CASCADE' })

export { EnrollmentModel }
