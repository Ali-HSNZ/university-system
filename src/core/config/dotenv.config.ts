import dotenv from 'dotenv'
import { StringValue } from 'ms'
dotenv.config()

const APP_ENV = {
    application: {
        port: process.env.PORT,
        protocol: process.env.PROTOCOL,
        host: process.env.HOST
    },
    token: {
        secretKey: (process.env.JWT_SECRET_KEY || 'secret-key') as string,
        expiresIn: (process.env.JWT_EXPIRES_IN || '1d') as StringValue
    },
    database: {
        dialect: process.env.DB_DIALECT,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT as string,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        name: process.env.DB_NAME
    }
}

export { APP_ENV }
