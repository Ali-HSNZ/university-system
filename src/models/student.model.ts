import { DataTypes } from 'sequelize'
import { sequelizeConfig } from '../core/config/database.config'
import { UserModel } from './user.model'
import { DegreeModel } from './degree.model'
import { DepartmentModel } from './department.model'
import { HighSchoolDiplomaModel } from './highSchoolDiploma.model'
import { APP_ENV } from '../core/config/dotenv.config'
import { StudyModel } from './study.model'

const StudentModel = sequelizeConfig.define(
    'students',
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        student_code: { type: DataTypes.STRING(10), allowNull: false },
        pre_degree_id: { type: DataTypes.INTEGER, allowNull: true },
        degree_id: { type: DataTypes.INTEGER, allowNull: true },
        study_id: { type: DataTypes.INTEGER, allowNull: false },
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
        high_school_diploma_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: { model: 'high_school_diplomas', key: 'id' },
            onDelete: 'SET NULL'
        },
        national_card_image: { type: DataTypes.STRING(255), allowNull: true },
        birth_certificate_image: { type: DataTypes.STRING(255), allowNull: true },
        military_service_image: { type: DataTypes.STRING(255), allowNull: true }
    },
    { timestamps: true, freezeTableName: true }
)

StudentModel.belongsTo(UserModel, { foreignKey: 'user_id', onDelete: 'CASCADE' })
StudentModel.belongsTo(DepartmentModel, { foreignKey: 'department_id', onDelete: 'CASCADE' })
StudentModel.belongsTo(StudyModel, { foreignKey: 'study_id', onDelete: 'CASCADE' })
StudentModel.belongsTo(HighSchoolDiplomaModel, { foreignKey: 'high_school_diploma_id', onDelete: 'SET NULL' })
StudentModel.belongsTo(DegreeModel, { foreignKey: 'pre_degree_id', onDelete: 'CASCADE' })
StudentModel.belongsTo(DegreeModel, { foreignKey: 'degree_id', onDelete: 'CASCADE' })

const protocol = APP_ENV.application.protocol
const host = APP_ENV.application.host
const port = APP_ENV.application.port

const BASE_URL = `${protocol}://${host}:${port}`

const files = ['national_card_image', 'birth_certificate_image', 'military_service_image']

const populateStudentData = async (student: any) => {
    if (!student) return

    files.forEach((field) => {
        if (student[field]) student[field] = `${BASE_URL}${student[field]}`
    })
}

StudentModel.addHook('afterFind', async (result: any) => {
    if (!result) return
    if (Array.isArray(result)) await Promise.all(result.map(populateStudentData))
    else await populateStudentData(result)
})
export { StudentModel }
