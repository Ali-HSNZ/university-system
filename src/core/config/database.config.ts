import { Dialect, Sequelize } from 'sequelize'
import { APP_ENV } from './dotenv.config'

const sequelizeConfig = new Sequelize({
    dialect: APP_ENV.database.dialect as Dialect,
    host: APP_ENV.database.host,
    port: parseInt(APP_ENV.database.port),
    username: APP_ENV.database.user,
    password: APP_ENV.database.password,
    database: APP_ENV.database.name,
    logging: false
})

const connectToDatabase = async () => {
    try {
        await sequelizeConfig.authenticate().then(() => {
            sequelizeConfig
                .sync({ alter: true })
                .then(() => console.log('Database Synced successfully'))
                .catch((error) => console.error('Error Syncing Database', error))
        })
        console.log('Connected to DB Successfully')
    } catch (error) {
        console.error('\x1b[31mError connecting to DB')
        process.exit(0)
    }
}

connectToDatabase()

export { sequelizeConfig }
