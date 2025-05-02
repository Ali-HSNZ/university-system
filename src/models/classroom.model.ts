import { DataTypes } from 'sequelize'
import { sequelizeConfig } from '../core/config/database.config'

const ClassroomModel = sequelizeConfig.define(
    'classroom',
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false }, // نام - مثل "سالن 101"
        building_name: { type: DataTypes.STRING, allowNull: false }, // نام ساختمان - مثل "ساختمان 1"
        floor_number: { type: DataTypes.STRING, allowNull: false }, // طبقه - مثل "1"
        capacity: { type: DataTypes.INTEGER, allowNull: false }, // ظرفیت - مثل "30"
        description: { type: DataTypes.TEXT, allowNull: true } // توضیحات - مثل "سالن کوچک با ظرفیت 30 نفر"
    },
    { timestamps: false, freezeTableName: true }
)

export { ClassroomModel }
