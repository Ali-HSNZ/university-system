import { Express } from 'express'
import httpStatus from 'http-status'

const notFoundRoute = (app: Express): void => {
    app.use((req, res): any => {
        return res.status(httpStatus.NOT_FOUND).json({
            statusCode: httpStatus.NOT_FOUND,
            message: 'صفحه مورد نظر یافت نشد'
        })
    })
}
export default notFoundRoute
