import { Dialect, Sequelize } from 'sequelize'
import dotenv from 'dotenv'
dotenv.config()

const sequelizeConfig = new Sequelize({
    dialect: process.env.DB_DIALECT as Dialect,
    host: process.env.DB_HOST as string,
    port: parseInt(process.env.DB_PORT as string),
    username: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_NAME as string
})

sequelizeConfig
    .authenticate()
    .then(async () => {
        console.log('Connected to the database')
    })
    .catch((err) => console.log('Error connecting to the database'))

export { sequelizeConfig }
 