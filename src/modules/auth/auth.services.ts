import { ProfessorModel } from '../../models/professor.model'
import { StudentModel } from '../../models/student.model'
import { UserModel } from '../../models/user.model'
import { TRegisterProfessorInferType, TRegisterStudentInferType, TBaseUserDataType } from './auth.types'

const authServices = {
    registerUser: async (data: TBaseUserDataType) => {
        const user = await UserModel.create(data)
        return user
    },
    registerStudent: async (data: TRegisterStudentInferType & { user_id: number }) => {
        const student = await StudentModel.create(data)
        return student
    },
    registerProfessor: async (data: TRegisterProfessorInferType & { user_id: number }) => {
        const professor = await ProfessorModel.create(data)
        return professor
    }
}

export default authServices
