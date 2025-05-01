import { sequelizeConfig } from '../core/config/database.config'

const { DataTypes } = require('sequelize')

const SemesterModel = sequelizeConfig.define(
    'semester',
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        academic_year: { type: DataTypes.STRING(9), allowNull: false },
        term_number: { type: DataTypes.ENUM('1', '2'), allowNull: false },
        start_date: { type: DataTypes.DATEONLY, allowNull: false },
        end_date: { type: DataTypes.DATEONLY, allowNull: false },
        status: {
            type: DataTypes.ENUM('active', 'de-active'),
            allowNull: false,
            defaultValue: 'de-active'
        },
        deleted_at: { type: DataTypes.DATE, allowNull: true },
        is_deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
    },
    { timestamps: false, freezeTableName: true }
)

export { SemesterModel }
