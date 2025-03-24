import { TRegisterValidationType } from '../auth/auth.types'

type TCheckExistUserType = {
    national_code?: string
    phone?: string
    email?: string
}

type TUpdateUserDataType = Omit<TRegisterValidationType, 'national_code_image' | 'military_image' | 'avatar'> & {
    national_code_image: string | null
    military_image: string | null
    avatar: string | null
}
export type { TCheckExistUserType, TUpdateUserDataType }
