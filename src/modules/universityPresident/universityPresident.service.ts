import { UniversityPresidentModel } from '../../models/universityPresident.model'
import { UserModel } from '../../models/user.model'
import { APP_ENV } from '../../core/config/dotenv.config'

const protocol = APP_ENV.application.protocol
const host = APP_ENV.application.host
const port = APP_ENV.application.port

const BASE_URL = `${protocol}://${host}:${port}`

const universityPresidentService = {
    list: async () => {
        const universityPresidents = await UniversityPresidentModel.findAll({
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
                }
            ],
            attributes: {
                exclude: ['updatedAt', 'degree_id', 'department_id', 'user_id']
            }
        })
        return universityPresidents.map((universityPresident) => {
            if (universityPresident.dataValues.user && universityPresident.dataValues.user.avatar) {
                universityPresident.dataValues.user.avatar = `${BASE_URL}${universityPresident.dataValues.user.avatar}`
            }
            return universityPresident
        })
    },
    checkExistByUserId: async (user_id: number) => {
        const universityPresident = await UniversityPresidentModel.findOne({ where: { user_id } })
        return !!universityPresident
    }
}

export default universityPresidentService
