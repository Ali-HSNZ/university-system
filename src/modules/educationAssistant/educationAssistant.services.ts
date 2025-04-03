import { DegreeModel } from "../../models/degree.model"
import { UserModel } from "../../models/user.model"
import { DepartmentModel } from "../../models/department.model"
import { EducationAssistantModel } from "../../models/educationAssistant.model"

const educationAssistantServices = {
    list: async () => {
        const educationAssistants = EducationAssistantModel.findAll({
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
        return educationAssistants
    }
}

export default educationAssistantServices
