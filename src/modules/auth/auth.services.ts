import { UserModel } from '../../models/user.model'
import { TRegisterDataType } from './auth.types'

const authServices = {
    register: async (data: TRegisterDataType) => {
        const user = await UserModel.create(data)
        return user
    }
}

export default authServices
