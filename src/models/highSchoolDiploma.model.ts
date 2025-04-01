import { DataTypes } from 'sequelize'
import { sequelizeConfig } from '../core/config/database.config'
import { UserModel } from './user.model'
import { DegreeModel } from './degree.model'

const HighSchoolDiplomaModel = sequelizeConfig.define(
    'high_school_diplomas',
    {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'users', key: 'id' },
            onDelete: 'CASCADE'
        },
        school_name: { type: DataTypes.STRING(255), allowNull: false },
        diploma_date: { type: DataTypes.DATE, allowNull: false },
        pre_degree_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'degree',
                key: 'id'
            }
        }
    },
    { timestamps: true, freezeTableName: true }
)

HighSchoolDiplomaModel.belongsTo(DegreeModel, { foreignKey: 'pre_degree_id', onDelete: 'CASCADE' })
HighSchoolDiplomaModel.belongsTo(UserModel, { foreignKey: 'user_id', onDelete: 'CASCADE' })

export { HighSchoolDiplomaModel }
