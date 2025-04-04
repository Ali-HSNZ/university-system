import { DataTypes } from 'sequelize'
import { sequelizeConfig } from '../core/config/database.config'
import { ClassModel } from './class.model'
import { ProfessorModel } from './professor.model'

const ClassProfessorModel = sequelizeConfig.define(
    'class_professor',
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        class_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: ClassModel, key: 'id' } }, // کلاس
        professor_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: ProfessorModel, key: 'id' } }
    },
    { timestamps: false, freezeTableName: true }
)

ClassProfessorModel.belongsTo(ClassModel, { foreignKey: 'class_id', onDelete: 'CASCADE' })
ClassProfessorModel.belongsTo(ProfessorModel, { foreignKey: 'professor_id', onDelete: 'CASCADE' })

export { ClassProfessorModel }
