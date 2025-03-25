import { DataTypes } from 'sequelize'
import { sequelizeConfig } from '../core/config/database.config'
import { UserModel } from './user.model'
import { DegreeModel } from './degree.model'
import { DepartmentModel } from './department.model'

const StudentModel = sequelizeConfig.define(
    'students',
    {
        student_code: { type: DataTypes.STRING(10), allowNull: false },
        degree_id: { type: DataTypes.INTEGER, allowNull: false },
        department_id: { type: DataTypes.INTEGER, allowNull: false },
        entry_year: { type: DataTypes.INTEGER, allowNull: false },
        entry_semester: { type: DataTypes.ENUM('1', '2'), allowNull: false },
        student_status: {
            type: DataTypes.ENUM('active', 'deActive', 'studying', 'graduate'),
            allowNull: false,
            defaultValue: 'studying'
        },
        total_passed_units: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        current_term_units: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        probation_terms: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        term_gpa: { type: DataTypes.FLOAT, allowNull: true },
        total_gpa: { type: DataTypes.FLOAT, allowNull: true },
        military_status: {
            type: DataTypes.ENUM('active', 'completed', 'exempted', 'postponed'),
            allowNull: true,
            defaultValue: 'active'
        },
        guardian_name: { type: DataTypes.STRING(100), allowNull: true },
        guardian_phone: { type: DataTypes.STRING(11), allowNull: true },
        high_school_diploma: { type: DataTypes.STRING(255), allowNull: true },
        pre_university_certificate: { type: DataTypes.STRING(255), allowNull: true },
        national_card_image: { type: DataTypes.STRING(255), allowNull: true },
        birth_certificate_image: { type: DataTypes.STRING(255), allowNull: true },
        military_service_image: { type: DataTypes.STRING(255), allowNull: true }
    },
    { timestamps: true, freezeTableName: true }
)

StudentModel.belongsTo(UserModel, { foreignKey: 'user_id', onDelete: 'CASCADE' })
StudentModel.belongsTo(DegreeModel, { foreignKey: 'degree_id', onDelete: 'CASCADE' })
StudentModel.belongsTo(DepartmentModel, { foreignKey: 'department_id', onDelete: 'CASCADE' })

export { StudentModel }
