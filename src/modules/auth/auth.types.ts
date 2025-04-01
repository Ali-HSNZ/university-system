import { InferType } from 'yup'
import { registerStudentValidation } from './auth.validation'

type TUserRoleType = 'student' | 'professor' | 'education_assistant' | 'university_president'

type TUserGenderType = 'male' | 'female'

type TRegisterUserType = InferType<typeof registerStudentValidation>

type TRegisterStudentType = {
    student_code: string
    pre_degree_id: number | undefined
    department_id: number
    entry_year: number
    entry_semester: '1' | '2'
    student_status: 'active' | 'deActive' | 'studying' | 'graduate'
    total_passed_units: number
    current_term_units: number
    probation_terms: number
    term_gpa?: number | null
    total_gpa?: number | null
    military_status?: 'active' | 'completed' | 'exempted' | 'postponed'
    guardian_name?: string | null
    guardian_phone?: string | null
    high_school_diploma_id?: number | null
    national_card_image?: TRegisterUserType['national_card_image']
    birth_certificate_image?: TRegisterUserType['birth_certificate_image']
    military_service_image?: TRegisterUserType['military_service_image']
}

type TRegisterValidationType = {
    first_name?: string
    last_name?: string
    national_code: string
    training_course_code?: string | null
    password?: string
    role?: TUserRoleType
    gender?: TUserGenderType
    national_code_image?: Express.Multer.File
    military_image?: Express.Multer.File
    military_status?: 'active' | 'completed' | 'exempted' | 'postponed' | null
    phone?: string
    email?: string
    avatar?: Express.Multer.File
    entry_date?: string | null
    degree_id?: string
    entry_semester?: '1' | '2' | null
    student_status?: 'active' | 'deActive' | 'studying' | 'graduate' | null
    department_id?: string | null
}

type TRegisterDataType = Omit<TRegisterValidationType, 'national_code_image' | 'military_image' | 'avatar'> & {
    national_code_image: string | null
    military_image: string | null
    avatar: string | null
    student_code: string | null
    deputy_code: string | null
    professor_code: string | null
}

type TGetSpecialUserDataType = {
    data: TRegisterValidationType
    usersCount: number
}

type TRegisterStudentFilesType = {
    national_card_image: Express.Multer.File[] | undefined
    birth_certificate_image: Express.Multer.File[] | undefined
    military_service_image: Express.Multer.File[] | undefined
    avatar: Express.Multer.File[] | undefined
}

type TGetValidRegisterDataType = Omit<TRegisterValidationType, 'national_code_image' | 'military_image' | 'avatar'> & {
    national_code_image: string | null
    military_image: string | null
    avatar: string | null
    usersCount: number
}

export type {
    TRegisterStudentFilesType,
    TRegisterDataType,
    TGetValidRegisterDataType,
    TGetSpecialUserDataType,
    TUserRoleType,
    TUserGenderType,
    TRegisterValidationType,
    TRegisterStudentType,
    TRegisterUserType
}
