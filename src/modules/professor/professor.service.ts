import { DepartmentModel } from '../../models/department.model'
import { UserModel } from '../../models/user.model'
import { DegreeModel } from '../../models/degree.model'
import { ProfessorModel } from '../../models/professor.model'
import { APP_ENV } from '../../core/config/dotenv.config'

const protocol = APP_ENV.application.protocol
const host = APP_ENV.application.host
const port = APP_ENV.application.port

const BASE_URL = `${protocol}://${host}:${port}`

const professorServices = {
    list: async () => {
        const professors = await ProfessorModel.findAll({
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
                { model: DegreeModel, attributes: { exclude: ['id', 'createdAt', 'updatedAt'] } },
                { model: DepartmentModel, attributes: { exclude: ['id', 'createdAt', 'updatedAt'] } }
            ],
            attributes: {
                exclude: ['updatedAt', 'degree_id', 'department_id', 'user_id']
            }
        })

        return professors.map((professor) => {
            if (professor.dataValues.user && professor.dataValues.user.avatar) {
                professor.dataValues.user.avatar = `${BASE_URL}${professor.dataValues.user.avatar}`
            }
            return professor
        })
    }
}

export default professorServices
