type TUserRoleType = 'student' | 'professor' | 'education_assistant' | 'university_president'

type TUserGenderType = 'male' | 'female'

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
    allUsersCount: number
}

type TRegisterFilesType = {
    national_code_image: Express.Multer.File[] | undefined
    military_image: Express.Multer.File[] | undefined
    avatar: Express.Multer.File[] | undefined
}

type TCheckExistUserType = {
    national_code?: string
    phone?: string
    email?: string
}

type TGetValidRegisterDataType = Omit<TRegisterValidationType, 'national_code_image' | 'military_image' | 'avatar'> & {
    national_code_image: string | null
    military_image: string | null
    avatar: string | null
    allUsersCount: number
}

export type {
    TRegisterFilesType,
    TRegisterDataType,
    TCheckExistUserType,
    TGetValidRegisterDataType,
    TGetSpecialUserDataType,
    TUserRoleType,
    TUserGenderType
}
