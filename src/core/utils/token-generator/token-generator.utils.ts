import jsonwebtoken from 'jsonwebtoken'
import { APP_ENV } from '../../config/dotenv.config'
import TTokenGeneratorType from './token-generator.types'

const tokenGenerator = (payload: TTokenGeneratorType) => {
    const secretKey = APP_ENV.token.secretKey
    const expiresIn = APP_ENV.token.expiresIn

    const token = jsonwebtoken.sign(payload, secretKey, { expiresIn })
    return token
}

export default tokenGenerator
