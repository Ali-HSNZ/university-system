import { DataTypes } from 'sequelize'
import { sequelizeConfig } from '../core/config/database.config'
import { UserModel } from './user.model'

const EnrollmentStatusModel = sequelizeConfig.define(
    'enrollment_status',
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        enrollment_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'enrollment',
                key: 'id'
            }
        },
        status: {
            type: DataTypes.ENUM(
                'pending_department_head', // انتظار تایید از مدیر گروه
                'pending_education_assistant', // انتظار تایید از معاون آموزشی
                'approved_by_department_head', // تایید از مدیر گروه
                'approved_by_education_assistant', // تایید از معاون آموزشی
                'rejected_by_department_head', // رد از مدیر گروه
                'rejected_by_education_assistant' // رد از معاون آموزشی
            ),
            allowNull: false,
            defaultValue: 'pending_department_head'
        },
        department_head_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: UserModel,
                key: 'id'
            },
            comment: 'شناسه مدیر گروه'
        },
        education_assistant_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: UserModel,
                key: 'id'
            },
            comment: 'شناسه معاون آموزشی'
        },
        department_head_comment: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'توضیحات مدیر گروه'
        },
        education_assistant_comment: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'توضیحات معاون آموزشی'
        },
        department_head_decision_date: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'تاریخ تصمیم مدیر گروه'
        },
        education_assistant_decision_date: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'تاریخ تصمیم معاون آموزشی'
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW
        }
    },
    {
        timestamps: false,
        freezeTableName: true,
        tableName: 'enrollment_status',
        underscored: true
    }
)

// Define associations
EnrollmentStatusModel.belongsTo(UserModel, { foreignKey: 'department_head_id', as: 'department_head' })
EnrollmentStatusModel.belongsTo(UserModel, { foreignKey: 'education_assistant_id', as: 'education_assistant' })

export { EnrollmentStatusModel }
