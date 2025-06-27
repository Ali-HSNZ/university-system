import { DataTypes } from 'sequelize'
import { sequelizeConfig } from '../core/config/database.config'
import { UserModel } from './user.model'
import { StudyModel } from './study.model'

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
        diploma_date: { type: DataTypes.STRING, allowNull: false },
        grade: { type: DataTypes.FLOAT, allowNull: true },
        pre_study_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'study',
                key: 'id'
            }
        }
    },
    { timestamps: true, freezeTableName: true }
)

HighSchoolDiplomaModel.belongsTo(StudyModel, { foreignKey: 'pre_study_id', onDelete: 'CASCADE' })
HighSchoolDiplomaModel.belongsTo(UserModel, { foreignKey: 'user_id', onDelete: 'CASCADE' })

export { HighSchoolDiplomaModel }
