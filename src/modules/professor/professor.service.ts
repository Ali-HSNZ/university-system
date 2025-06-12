import { DepartmentModel } from '../../models/department.model'
import { UserModel } from '../../models/user.model'
import { DegreeModel } from '../../models/degree.model'
import { ProfessorModel } from '../../models/professor.model'
import { APP_ENV } from '../../core/config/dotenv.config'
import { StudyModel } from '../../models/study.model'

const protocol = APP_ENV.application.protocol
const host = APP_ENV.application.host
const port = APP_ENV.application.port

const BASE_URL = `${protocol}://${host}:${port}`

const professorService = {
    list: async (id?: number) => {
        const professors = await ProfessorModel.findAll({
            where: id ? { id } : undefined,
            include: [
                {
                    model: UserModel,
                    attributes: {
                        exclude: [
                            'id',
                            'createdAt',
                            'updatedAt',
                            'password',
                            'is_deleted',
                            'deleted_by',
                            'deleted_at',
                            'updated_at'
                        ]
                    }
                },
                { model: StudyModel, attributes: ['id', 'name'] },
                { model: DegreeModel, attributes: ['id', 'name'] },
                { model: DepartmentModel, attributes: ['id', 'name'] }
            ],
            attributes: {
                exclude: ['updatedAt', 'degree_id', 'department_id', 'user_id', 'study_id']
            }
        })

        return professors.map((professor) => {
            if (professor.dataValues.user && professor.dataValues.user.avatar) {
                professor.dataValues.user.avatar = `${BASE_URL}${professor.dataValues.user.avatar}`
            }

            return {
                ...professor.dataValues,
                hire_date: professor.dataValues.hire_date.replaceAll('-', '/'),
                user: {
                    ...professor.dataValues.user.dataValues,
                    birth_date: professor.dataValues.user.dataValues.birth_date.replaceAll('-', '/')
                }
            }
        })
    },
    info: async (id: number) => {
        const professor = await professorService.list(id)
        return professor[0]
    },
    checkExist: async (id: string | number | undefined) => {
        if (!id) return false

        const professor = await ProfessorModel.findByPk(id)
        return professor
    },
    checkExistByUserId: async (user_id: number | undefined) => {
        if (!user_id) return false
        const professor = await ProfessorModel.findOne({ where: { user_id } })
        return !!professor
    },
    getByUserId: async (user_id: number | undefined) => {
        if (!user_id) return null
        const professor = await ProfessorModel.findOne({ where: { user_id } })
        return professor
    },
    delete: async (id: number) => {
        const professor = await ProfessorModel.destroy({ where: { id } })
        return professor
    }
}

export default professorService
