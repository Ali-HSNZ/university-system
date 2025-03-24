import { hashString } from '../../core/utils/hash-string'
import { TGetSpecialUserDataType, TGetValidRegisterDataType } from '../auth/auth.types'
import authUtils from '../auth/auth.utils'
import { TUpdateUserDataType } from './user.types'

const userUtils = {
    getSpecialUserData: function ({ data, usersCount }: TGetSpecialUserDataType): TUpdateUserDataType {
        const national_code_image = authUtils.getFilePath(data.national_code_image?.path) || null
        const military_image = authUtils.getFilePath(data.military_image?.path) || null
        const avatar = authUtils.getFilePath(data.avatar?.path) || null

        const validData = {
            ...data,
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

    getStudentData: function (data: Omit<TGetValidRegisterDataType, 'usersCount'>) {
        const isMale = data.gender === 'male'
        return {
            ...data,
            military_status: isMale ? data.military_status : null,
            military_image: isMale ? data.military_image : null
        }
    },

    getProfessorData: (data: Omit<TGetValidRegisterDataType, 'usersCount'>): TUpdateUserDataType => {
        const isMale = data.gender === 'male'
        return {
            ...data,
            student_status: null,
            entry_semester: null,
            training_course_code: null,
            role: 'professor',
            military_image: isMale ? data.military_image : null,
            national_code_image: data.national_code_image,
            military_status: isMale ? data.military_status : null
        }
    },
    getEducationAssistantData: function (data: Omit<TGetValidRegisterDataType, 'usersCount'>): TUpdateUserDataType {
        return {
            ...data,
            student_status: null,
            entry_semester: null,
            training_course_code: null,
            role: 'education_assistant',
            military_status: null
        }
    },
    getUniversityPresidentData: (data: Omit<TGetValidRegisterDataType, 'usersCount'>): TUpdateUserDataType => {
        const isMale = data.gender === 'male'
        return {
            ...data,
            military_image: isMale ? data.military_image : null,
            student_status: null,
            military_status: isMale ? data.military_status : null,
            department_id: null,
            entry_date: null,
            entry_semester: null,
            training_course_code: null,
            role: 'university_president'
        }
    }
}

export default userUtils
