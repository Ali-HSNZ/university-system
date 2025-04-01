import { APP_ENV } from '../../core/config/dotenv.config'
import { DegreeModel } from '../../models/degree.model'
import { DepartmentModel } from '../../models/department.model'
import { HighSchoolDiplomaModel } from '../../models/highSchoolDiploma.model'
import { StudentModel } from '../../models/student.model'
import { UserModel } from '../../models/user.model'

const studentService = {
    list: async () => {
        const students = await StudentModel.findAll({
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
                { model: DepartmentModel, attributes: { exclude: ['id', 'createdAt', 'updatedAt'] } },
                {
                    model: HighSchoolDiplomaModel,
                    attributes: { exclude: ['id', 'createdAt', 'updatedAt', 'user_id', 'pre_degree_id'] },
                    include: [{ model: DegreeModel, attributes: { exclude: ['id', 'createdAt', 'updatedAt'] } }]
                }
            ],
            attributes: {
                exclude: ['updatedAt', 'pre_degree_id', 'department_id', 'high_school_diploma_id', 'user_id']
            }
        })

        const protocol = APP_ENV.application.protocol
        const host = APP_ENV.application.host
        const port = APP_ENV.application.port

        const BASE_URL = `${protocol}://${host}:${port}`

        return students.map((student) => {
            if (student.dataValues.user && student.dataValues.user.avatar) {
                student.dataValues.user.avatar = `${BASE_URL}${student.dataValues.user.avatar}`
            }
            return student
        })
        return students
    }
}

export default studentService
