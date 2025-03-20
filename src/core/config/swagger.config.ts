import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { Application } from 'express'
import path from 'path'
import fs from 'fs'

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'University System API',
            description: 'API documentation for the University System',
            version: '1.0.0'
        },
        servers: [{ url: `http://localhost:${process.env.PORT || 5000}` }],
        security: [{ BearerAuth: [] }],
        components: {
            securitySchemes: {
                BearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
            }
        }
    },
    apis: [path.join(__dirname, '../../docs/**/*.ts')]
}

const swaggerDocs = swaggerJSDoc(swaggerOptions)

const setupSwagger = (app: Application) => {
    const styles = fs.readFileSync(path.join(__dirname, '../../../src/styles/swagger.styles.css'), 'utf8')
    app.use(
        '/docs',
        swaggerUi.serve,
        swaggerUi.setup(swaggerDocs, {
            customCss: styles,
            customSiteTitle: 'University System API'
        })
    )
}

export default setupSwagger
