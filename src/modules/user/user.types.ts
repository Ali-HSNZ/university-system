import { InferType } from 'yup'
import { updateUserPasswordValidation } from './user.validations'

type TFindOneUserType = {
    national_code?: string
    phone?: string | null
    email?: string | null
}

type TUpdateUserPasswordInferType = InferType<typeof updateUserPasswordValidation>

export type { TFindOneUserType, TUpdateUserPasswordInferType }
