import { Request } from 'express'
import { TUserType } from '../user'

type TAuthenticatedRequestType = Request & {
    user?: TUserType
}

export default TAuthenticatedRequestType
