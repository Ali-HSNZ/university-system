import { EducationAssistantModel } from '../../models/educationAssistant.model'
import { ProfessorModel } from '../../models/professor.model'
import { StudentModel } from '../../models/student.model'
import { UserModel } from '../../models/user.model'
import { TRegisterProfessorInferType, TRegisterStudentInferType, TBaseUserDataType, TRegisterEducationAssistantInferType } from './auth.types'

const authServices = {
    registerUser: async (data: TBaseUserDataType) => {
        const user = await UserModel.create(data)
        return user
    },
    registerStudent: async (data: Omit<TRegisterStudentInferType, keyof TBaseUserDataType> & { user_id: number }) => {
        const student = await StudentModel.create(data)
        return student
    },
    registerProfessor: async (data: Omit<TRegisterProfessorInferType, keyof TBaseUserDataType> & { user_id: number }) => {
        const professor = await ProfessorModel.create(data)
        return professor
    },
    registerEducationAssistant: async (data: Omit<TRegisterEducationAssistantInferType, keyof TBaseUserDataType> & { user_id: number }) => {
        const educationAssistant = await EducationAssistantModel.create(data)
        return educationAssistant
    }
}

export default authServices
