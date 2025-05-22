import { DataTypes } from 'sequelize'
import { sequelizeConfig } from '../core/config/database.config'

const EnrollmentStatusModel = sequelizeConfig.define(
    'enrollment_status',
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        enrollment_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
                'rejected_by_education_assistant', // رد از معاون آموزشی 
            ),
            allowNull: false,
            defaultValue: 'pending_department_head'
        },
        approver_id: { type: DataTypes.INTEGER, allowNull: true, comment: 'شناسه تایید کننده' },
        comment: { type: DataTypes.TEXT, allowNull: true, comment: 'توضیحات' },
        approval_date: { type: DataTypes.DATE, allowNull: true, comment: 'تاریخ تایید/رد' }
    },
    { timestamps: true, freezeTableName: true }
)

export { EnrollmentStatusModel }
