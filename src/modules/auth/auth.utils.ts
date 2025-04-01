import { hashString } from '../../core/utils/hash-string'
import { TGetSpecialUserDataType, TGetValidRegisterDataType, TRegisterDataType } from './auth.types'

const authUtils = {
    getFilePath: (path?: string): string | null => {
        if (!path) return null

        const filePath = path.replace(/\\/g, '/')
        const index = filePath.indexOf('/uploads/')
        return filePath.slice(index)
    },
    getSpecialUserData: function ({ data, usersCount }: TGetSpecialUserDataType): TRegisterDataType {
        const national_code_image = authUtils.getFilePath(data.national_code_image?.path) || null
        const military_image = authUtils.getFilePath(data.military_image?.path) || null
        const avatar = authUtils.getFilePath(data.avatar?.path) || null

        const validData = {
            ...data,
            usersCount,
            national_code_image,
            military_image,
            avatar,
            password: hashString(data.password || '')
        }

        if (data.role === 'student') return this.getStudentData(validData)
        if (data.role === 'professor') return this.getProfessorData(validData)
        if (data.role === 'education_assistant') return this.getEducationAssistantData(validData)
        return this.getUniversityPresidentData(validData)
    },

    getStudentData: function (data: TGetValidRegisterDataType): TRegisterDataType {
        const isMale = data.gender === 'male'
        return {
            ...data,
            student_code: this.generateStudentCode(data),
            student_status: 'active',
            military_status: isMale ? data.military_status : null,
            military_image: isMale ? data.military_image : null,
            deputy_code: null,
            professor_code: null
        }
    },

    getProfessorData: (data: TGetValidRegisterDataType): TRegisterDataType => {
        const isMale = data.gender === 'male'
        return {
            ...data,
            deputy_code: null,
            student_code: null,
            student_status: null,
            entry_semester: null,
            training_course_code: null,
            professor_code: new Date().getTime().toString(),
            role: 'professor',
            military_image: isMale ? data.military_image : null,
            national_code_image: data.national_code_image,
            military_status: isMale ? data.military_status : null
        }
    },
    getEducationAssistantData: function (data: TGetValidRegisterDataType): TRegisterDataType {
        return {
            ...data,
            deputy_code: this.generateDeputyCode(data),
            professor_code: null,
            student_code: null,
            student_status: null,
            entry_semester: null,
            training_course_code: null,
            role: 'education_assistant',
            military_status: null
        }
    },
    getUniversityPresidentData: (data: TGetValidRegisterDataType): TRegisterDataType => {
        const isMale = data.gender === 'male'
        return {
            ...data,
            military_image: isMale ? data.military_image : null,
            deputy_code: null,
            professor_code: null,
            student_code: null,
            student_status: null,
            military_status: isMale ? data.military_status : null,
            department_id: null,
            entry_date: null,
            entry_semester: null,
            training_course_code: null,
            role: 'university_president'
        }
    },
    generateStudentCode: function (data: TGetValidRegisterDataType): string {
        const year = data.entry_date?.toString().slice(2, 4)
        const semester = data.entry_semester
        const training_course_code = data.training_course_code
        const university_code = 255
        const degree_id = data.degree_id
        const studentCode = data.usersCount + 1
        return `${year}${semester}${training_course_code}${university_code}${degree_id}${studentCode}`
    },
    generateProfessorCode: function (data: TGetValidRegisterDataType): string {
        const year = data.entry_date?.toString().slice(2, 4)
        return `${year}${data.usersCount + 1}${new Date().getTime()}`
    },
    generateDeputyCode: function (data: TGetValidRegisterDataType): string {
        const year = data.entry_date?.toString().slice(2, 4)
        return `${year}${data.usersCount + 1}${new Date().getTime()}`
    }
}

export default authUtils
