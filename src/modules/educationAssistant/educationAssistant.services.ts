import { DegreeModel } from '../../models/degree.model'
import { UserModel } from '../../models/user.model'
import { DepartmentModel } from '../../models/department.model'
import { EducationAssistantModel } from '../../models/educationAssistant.model'
import { APP_ENV } from '../../core/config/dotenv.config'

const protocol = APP_ENV.application.protocol
const host = APP_ENV.application.host
const port = APP_ENV.application.port

const BASE_URL = `${protocol}://${host}:${port}`

const educationAssistantServices = {
    list: async () => {
        const educationAssistants = await EducationAssistantModel.findAll({
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

        return educationAssistants.map((educationAssistant) => {
            if (educationAssistant.dataValues.user && educationAssistant.dataValues.user.avatar) {
                educationAssistant.dataValues.user.avatar = `${BASE_URL}${educationAssistant.dataValues.user.avatar}`
            }
            return educationAssistant
        })
    }
}

export default educationAssistantServices
