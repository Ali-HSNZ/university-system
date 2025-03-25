import { DataTypes } from 'sequelize'
import { sequelizeConfig } from '../core/config/database.config'

const UserModel = sequelizeConfig.define(
    'users',
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        first_name: { type: DataTypes.STRING(100), allowNull: false },
        last_name: { type: DataTypes.STRING(100), allowNull: false },
        national_code: {
            type: DataTypes.STRING(10),
            allowNull: false,
            validate: { isNumeric: true, len: [10, 10] }
        },
        gender: { type: DataTypes.ENUM('male', 'female'), allowNull: false },
        birth_date: { type: DataTypes.STRING, allowNull: false },
        phone: { type: DataTypes.STRING(11), allowNull: true },
        email: { type: DataTypes.STRING(100), allowNull: true },
        address: { type: DataTypes.STRING(255), allowNull: true },
        role: {
            type: DataTypes.ENUM('student', 'professor', 'education_assistant', 'university_president'),
            allowNull: false
        },
        password: { type: DataTypes.STRING(255), allowNull: false },
        avatar: { type: DataTypes.STRING(255), allowNull: true },
        is_deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        deleted_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: { model: 'users', key: 'id' },
            onDelete: 'SET NULL'
        }
    },
    {
        timestamps: true,
        freezeTableName: true,
        paranoid: true, // حذف نرم
        deletedAt: 'deleted_at', // ذخیره زمان حذف
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        defaultScope: {
            attributes: { exclude: ['created_at', 'updated_at'] }
        }
    }
)

export { UserModel }
