import express from 'express'
import http from 'http'
import httpStatus from 'http-status'
import './app.module'

import { type TCriticalAnyType } from './core/types/common.types'
import ApplicationRoutes from './index.routes'
import { APP_ENV } from './core/config/dotenv.config'
import setupSwagger from './core/config/swagger.config' // Import Swagger config
import path from 'path'
const app = express()
const server = http.createServer(app)

app.use('/', express.static(path.join(__dirname, '../public')))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(ApplicationRoutes)

setupSwagger(app)

app.use((req, res): TCriticalAnyType => {
    return res.status(httpStatus.NOT_FOUND).json({
        statusCode: httpStatus.NOT_FOUND,
        message: 'Not Found Page'
    })
})

server.listen(APP_ENV.application.port, () => {
    console.log(`Server is running on http://localhost:${APP_ENV.application.port}`)
})

