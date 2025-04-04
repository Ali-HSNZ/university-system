import { EducationAssistantModel } from '../../models/educationAssistant.model'
import { ProfessorModel } from '../../models/professor.model'
import { StudentModel } from '../../models/student.model'
import { UniversityPresidentModel } from '../../models/universityPresident.model'
import { UserModel } from '../../models/user.model'
import educationAssistantServices from '../educationAssistant/educationAssistant.service'
import professorService from '../professor/professor.service'
import studentService from '../student/student.service'
import universityPresidentService from '../universityPresident/universityPresident.service'
import {
    TRegisterProfessorInferType,
    TRegisterStudentInferType,
    TBaseUserDataType,
    TRegisterEducationAssistantInferType,
    TRegisterUniversityPresidentInferType
} from './auth.types'

const authServices = {
    findOne: async (nationalCode: TBaseUserDataType['national_code']) => {
        const user = await UserModel.findOne({ where: { national_code: nationalCode } })
        return user
    },

    registerUser: async (data: TBaseUserDataType) => {
        const user = await UserModel.create(data)
        return user
    },

    registerStudent: async (data: Omit<TRegisterStudentInferType, keyof TBaseUserDataType> & { user_id: number }) => {
        const student = await StudentModel.create(data)
        return student
    },

    registerProfessor: async (
        data: Omit<TRegisterProfessorInferType, keyof TBaseUserDataType> & { user_id: number }
    ) => {
        const professor = await ProfessorModel.create(data)
        return professor
    },

    registerEducationAssistant: async (
        data: Omit<TRegisterEducationAssistantInferType, keyof TBaseUserDataType> & { user_id: number }
    ) => {
        const educationAssistant = await EducationAssistantModel.create(data)
        return educationAssistant
    },

    registerUniversityPresident: async (
        data: Omit<TRegisterUniversityPresidentInferType, keyof TBaseUserDataType> & { user_id: number }
    ) => {
        const universityPresident = await UniversityPresidentModel.create(data)
        return universityPresident
    },
    checkValidUser: async (
        id: number,
        role: 'student' | 'professor' | 'educationAssistant' | 'universityPresident'
    ) => {
        if (role === 'student') {
            const student = await studentService.checkExistByUserId(id)
            if (!student) throw new Error('دانشجویی با این مشخصات یافت نشد')
        }

        if (role === 'professor') {
            const professor = await professorService.checkExistByUserId(id)
            if (!professor) throw new Error('استادی با این مشخصات یافت نشد')
        }

        if (role === 'educationAssistant') {
            const educationAssistant = await educationAssistantServices.checkExistByUserId(id)
            if (!educationAssistant) throw new Error('معاون آموزشی با این مشخصات یافت نشد')
        }

        if (role === 'universityPresident') {
            const universityPresident = await universityPresidentService.checkExistByUserId(id)
            if (!universityPresident) throw new Error('رئیس دانشکده با این مشخصات یافت نشد')
        }
    }
}

export default authServices
