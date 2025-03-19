import express from 'express'
import http from 'http'
import httpStatus from 'http-status'
import './app.module'

import { type TCriticalAnyType, type TResponseMethodType } from './core/types/common.types'
import ApplicationRoutes from './routes/index.routes'
import sequelizeConfig from './core/config/database.config'
import { APP_ENV } from './core/config/dotenv.config'
import setupSwagger from './core/config/swagger.config' // Import Swagger config

const app = express()
const server = http.createServer(app)
const PORT = APP_ENV.application.port

sequelizeConfig.sync({ alter: true })

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(ApplicationRoutes)

setupSwagger(app)

app.use((req, res): TCriticalAnyType => {
    const response: TResponseMethodType = {
        statusCode: httpStatus.NOT_FOUND,
        message: 'Not Found Page'
    }
    return res.status(httpStatus.NOT_FOUND).json(response)
})

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})

