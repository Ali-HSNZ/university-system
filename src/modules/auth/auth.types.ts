import { InferType } from 'yup'
import {
    loginValidation,
    registerDepartmentHeadValidation,
    registerEducationAssistantValidation,
    registerProfessorValidation,
    registerStudentValidation,
    registerUniversityPresidentValidation
} from './auth.validation'

type TUserGenderType = 'male' | 'female'

type TLoginInferType = InferType<typeof loginValidation>

type TRegisterStudentInferType = InferType<typeof registerStudentValidation>

type TRegisterProfessorInferType = InferType<typeof registerProfessorValidation>

type TRegisterEducationAssistantInferType = InferType<typeof registerEducationAssistantValidation>

type TRegisterDepartmentHeadInferType = InferType<typeof registerDepartmentHeadValidation>

type TRegisterUniversityPresidentInferType = InferType<typeof registerUniversityPresidentValidation>

type TBaseUserDataType = {
    first_name: string //
    last_name: string //
    national_code: string //
    gender: TUserGenderType //
    birth_date: string //
    phone?: string
    email?: string
    address?: string
    role: 'student' | 'professor' | 'education_assistant' | 'university_president' | 'department_head'
    password: string
    avatar?: string
}

type TRegisterStudentFilesType = {
    national_card_image: Express.Multer.File[] | undefined
    birth_certificate_image: Express.Multer.File[] | undefined
    military_service_image: Express.Multer.File[] | undefined
    avatar: Express.Multer.File[] | undefined
}

type TRegisterProfessorFilesType = {
    avatar: Express.Multer.File[] | undefined
    cv_file: Express.Multer.File[] | undefined
    national_card_file: Express.Multer.File[] | undefined
    birth_certificate_file: Express.Multer.File[] | undefined
    military_service_file: Express.Multer.File[] | undefined
    phd_certificate_file: Express.Multer.File[] | undefined
    employment_contract_file: Express.Multer.File[] | undefined
}

type TRegisterEducationAssistantFilesType = {
    avatar: Express.Multer.File[] | undefined
    national_card_image: Express.Multer.File[] | undefined
    birth_certificate_image: Express.Multer.File[] | undefined
    military_service_image: Express.Multer.File[] | undefined
    employment_contract_file: Express.Multer.File[] | undefined
}

type TRegisterUniversityPresidentFilesType = {
    avatar: Express.Multer.File[] | undefined
    national_card_image: Express.Multer.File[] | undefined
    birth_certificate_image: Express.Multer.File[] | undefined
    military_service_image: Express.Multer.File[] | undefined
    employment_contract_file: Express.Multer.File[] | undefined
    phd_certificate_file: Express.Multer.File[] | undefined
}
export type {
    TRegisterStudentFilesType,
    TRegisterEducationAssistantFilesType,
    TRegisterProfessorFilesType,
    TRegisterUniversityPresidentFilesType,
    TRegisterStudentInferType,
    TLoginInferType,
    TRegisterProfessorInferType,
    TRegisterEducationAssistantInferType,
    TRegisterUniversityPresidentInferType,
    TUserGenderType,
    TBaseUserDataType,
    TRegisterDepartmentHeadInferType
}
