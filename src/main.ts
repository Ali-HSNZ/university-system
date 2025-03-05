import dotenv from 'dotenv'
import express from 'express'
import http from 'http'

import './app.module'

import { type TCriticalAnyType, type TResponseMethodType } from './core/types/common.types'
import ApplicationRoutes from './routes/index.routes'
import { sequelizeConfig } from './core/config/database.config'

dotenv.config()
const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT

sequelizeConfig.sync({ alter: true })

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(ApplicationRoutes)

app.use((req, res): TCriticalAnyType => {
    const response: TResponseMethodType = {
        statusCode: 404,
        message: 'Not Found Page'
    }
    return res.status(404).json(response)
})

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})

