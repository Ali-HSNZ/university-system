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

    profile: async (user_id: number) => {
        const universityPresident = await UniversityPresidentModel.findOne({
            where: { user_id },
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

        return {
            profile_information: {
                avatar: BASE_URL + universityPresident?.dataValues.user.avatar,
                full_name:
                    universityPresident?.dataValues.user.first_name +
                    ' ' +
                    universityPresident?.dataValues.user.last_name,
                national_code: universityPresident?.dataValues.user.national_code,
                gender: universityPresident?.dataValues.user.gender === 'male' ? 'مرد' : 'زن',
                birth_date: universityPresident?.dataValues.user.birth_date,
                phone_number: universityPresident?.dataValues.user.phone,
                email: universityPresident?.dataValues.user.email,
                address: universityPresident?.dataValues.user.address
            },
            work_information: {
                president_code: universityPresident?.dataValues.president_code,
                work_experience_years: universityPresident?.dataValues.work_experience_years,
                office_phone: universityPresident?.dataValues.office_phone,
                office_address: universityPresident?.dataValues.office_address,
                responsibilities: universityPresident?.dataValues.responsibilities
            },
            files: {
                national_card_image: universityPresident?.dataValues.national_card_image,
                birth_certificate_image: universityPresident?.dataValues.birth_certificate_image,
                military_service_image: universityPresident?.dataValues.military_service_image,
                phd_certificate: universityPresident?.dataValues.phd_certificate,
                employment_contract: universityPresident?.dataValues.employment_contract
            }
        }
    },
    checkExistByUserId: async (user_id: number) => {
        const universityPresident = await UniversityPresidentModel.findOne({ where: { user_id } })
        return !!universityPresident
    }
}

export default universityPresidentService
