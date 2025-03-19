import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { Application } from 'express'
import path from 'path'
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'University System API',
            description: 'API documentation for the University System',
            version: '1.0.0'
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 5000}`
            }
        ],
        security: [
            {
                BearerAuth: [] // Security scheme added here
            }
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: [path.join(__dirname, '../../docs/*.ts')] // ✅ Dynamic path resolution
}

const swaggerDocs = swaggerJSDoc(swaggerOptions)

const setupSwagger = (app: Application) => {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
}


export default setupSwagger