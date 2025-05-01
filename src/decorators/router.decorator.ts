import { Router, RequestHandler } from 'express'
import { AuthenticateMiddleware } from '../core/middleware/authenticate'
import {
    TMethodType,
    CustomRequestHandler,
    RouteDefinition,
    TAuthenticateMiddlewareWhitelist
} from './router.decorator.types'

const DecoratorRouter = Router()

// authenticate middleware whitelist
const whitelist: TAuthenticateMiddlewareWhitelist = [
    { method: 'post', path: '/auth/login' },
    { method: 'post', path: '/auth/register/student' },
    { method: 'post', path: '/auth/register/professor' },
    { method: 'post', path: '/auth/register/education-assistant' },
    { method: 'post', path: '/auth/register/university-president' }
]

const normalizePath = (path: string) => (path.startsWith('/') ? path : `/${path}`)

const UseMiddleware = (...middlewares: RequestHandler[]) => {
    return (target: any, propertyKey: string) => {
        const handler = target[propertyKey] as CustomRequestHandler
        if (!handler.__middleware) {
            handler.__middleware = []
        }
        handler.__middleware.push(...middlewares)
    }
}

const Controller = (basePath: string = '') => {
    return (target: any) => {
        const router = Router()
        const instance = new target()
        const routes: RouteDefinition[] = target.prototype.__routes || []

        routes.forEach(({ path, method, handler }) => {
            const boundHandler = handler.bind(instance)
            const localMiddleware = handler.__middleware ?? []

            const fullPath = normalizePath(`${basePath}${path}`)

            const isWhitelisted = whitelist.some((route) => route.path === fullPath && route.method === method)

            const finalMiddlewares: any[] = isWhitelisted
                ? [...localMiddleware, boundHandler]
                : [AuthenticateMiddleware, ...localMiddleware, boundHandler]

            router[method](path, ...finalMiddlewares)
        })

        DecoratorRouter.use(basePath, router)
    }
}

const createMethodDecorator =
    (method: TMethodType) =>
    (path: string = '') => {
        return (target: any, propertyKey: string) => {
            if (!target.__routes) target.__routes = []
            target.__routes.push({
                path: normalizePath(path),
                method,
                handler: target[propertyKey] as CustomRequestHandler
            })
        }
    }

const Get = createMethodDecorator('get')
const Post = createMethodDecorator('post')
const Put = createMethodDecorator('put')
const Delete = createMethodDecorator('delete')
const Patch = createMethodDecorator('patch')

export default DecoratorRouter

export { Controller, Get, Post, Put, Delete, Patch, UseMiddleware }
