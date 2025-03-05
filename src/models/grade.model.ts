import { DataTypes } from 'sequelize'
import { sequelizeConfig } from '../core/config/database.config'
import { EnrollmentModel } from './enrollment.model'
import { UserModel } from './user.model'

const GradeModel = sequelizeConfig.define(
    'grade',
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        midterm_score: { type: DataTypes.INTEGER, allowNull: true },
        final_score: { type: DataTypes.INTEGER, allowNull: true },
        total_score: { type: DataTypes.INTEGER, allowNull: true }
    },
    { timestamps: false, freezeTableName: true }
)

GradeModel.addHook('beforeSave', (model: any) => {
    const score = (model.midterm_score || 0) + (model.final_score || 0)
    model.total_score = score > 20 ? 20 : score
})

GradeModel.belongsTo(EnrollmentModel, { foreignKey: 'enrollment_id', onDelete: 'CASCADE' })
GradeModel.belongsTo(UserModel, { foreignKey: 'professor_id', onDelete: 'CASCADE' })

export { GradeModel }
