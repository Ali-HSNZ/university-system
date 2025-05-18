import { DegreeModel } from '../../models/degree.model'
import { UserModel } from '../../models/user.model'
import { DepartmentModel } from '../../models/department.model'
import { EducationAssistantModel } from '../../models/educationAssistant.model'
import { APP_ENV } from '../../core/config/dotenv.config'
import { DepartmentHeadModel } from '../../models/departmentHead.model'

const protocol = APP_ENV.application.protocol
const host = APP_ENV.application.host
const port = APP_ENV.application.port

const BASE_URL = `${protocol}://${host}:${port}`

const departmentHeadService = {
    list: async () => {
        const departmentHeads = await DepartmentHeadModel.findAll({
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

        return departmentHeads.map((departmentHead) => {
            if (departmentHead.dataValues.user && departmentHead.dataValues.user.avatar) {
                departmentHead.dataValues.user.avatar = `${BASE_URL}${departmentHead.dataValues.user.avatar}`
            }
            return departmentHead
        })
    },
    checkExistByUserId: async (user_id: number) => {
        const educationAssistant = await EducationAssistantModel.findOne({ where: { user_id } })
        return !!educationAssistant
    }
}

export default departmentHeadService
