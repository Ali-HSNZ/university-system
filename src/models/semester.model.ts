import { sequelizeConfig } from '../core/config/database.config'

const { DataTypes } = require('sequelize')

const SemesterModel = sequelizeConfig.define(
    'semester',
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        // description: "سال تحصیلی به صورت 'YYYY-YYYY' (مثال: '2024-2025')"
        academic_year: { type: DataTypes.STRING(9), allowNull: false },
        // description: 'شماره نیمسال: 1 (ترم اول) یا 2 (ترم دوم)'
        term_number: { type: DataTypes.ENUM('1', '2'), allowNull: false },
        // description: 'تاریخ شروع ترم'
        start_date: { type: DataTypes.DATEONLY, allowNull: false },
        // description: 'تاریخ پایان ترم'
        end_date: { type: DataTypes.DATEONLY, allowNull: false },
        // description: 'وضعیت ترم: upcoming (در انتظار)، ongoing (در حال اجرا)، completed (پایان‌یافته)'
        status: {
            type: DataTypes.ENUM('upcoming', 'ongoing', 'completed'),
            allowNull: false,
            defaultValue: 'upcoming'
        },
        deleted_at: { type: DataTypes.DATE, allowNull: true },
        is_deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
    },
    { timestamps: false, freezeTableName: true }
)

export { SemesterModel }
