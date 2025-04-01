import { DegreeModel } from '../../models/degree.model'
import { DepartmentModel } from '../../models/department.model'
import { HighSchoolDiplomaModel } from '../../models/highSchoolDiploma.model'
import { StudentModel } from '../../models/student.model'
import { UserModel } from '../../models/user.model'

const studentService = {
    list: async () => {
        const students = await StudentModel.findAll({
            include: [
                { model: UserModel },
                { model: DegreeModel },
                { model: DepartmentModel },
                { model: HighSchoolDiplomaModel }
            ]
        })
        return students
    }
}

export default studentService
