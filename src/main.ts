import express from 'express'
import http from 'http'
import morgan from 'morgan'
import './app.module'
import cors from 'cors'

import ApplicationRoutes from './index.routes'
import { APP_ENV } from './core/config/dotenv.config'
import setupSwagger from './core/config/swagger.config' // Import Swagger config
import path from 'path'
const app = express()
import { notFoundRoute } from './core/middleware/not-found-route'
import { exceptionErrorMiddleware } from './core/middleware/exception-error'
const server = http.createServer(app)

// serve static files
app.use('/', express.static(path.join(__dirname, '../public')))

// configure morgan for logging
app.use(morgan('dev'))

// parse urlencoded and json body
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// handle cors
app.use(cors())

// handle routes
app.use(ApplicationRoutes)

// configure swagger
setupSwagger(app)

// handle not found route
notFoundRoute(app)

// handle error
exceptionErrorMiddleware(app)

server.listen(APP_ENV.application.port, () => {
    console.log(`Server is running on http://localhost:${APP_ENV.application.port}`)
})