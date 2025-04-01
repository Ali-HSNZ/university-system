import { StudentModel } from '../../models/student.model'
import { UserModel } from '../../models/user.model'
import { TRegisterStudentType, TRegisterUserType, TUserRoleType } from './auth.types'

const authServices = {
    registerUser: async (data: TRegisterUserType & { role: TUserRoleType; password: string }) => {
        const user = await UserModel.create(data)
        return user
    },
    registerStudent: async (data: TRegisterStudentType & { user_id: number }) => {
        const student = await StudentModel.create(data)
        return student
    }
}

export default authServices
