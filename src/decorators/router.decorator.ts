import { Router, RequestHandler } from 'express'

type TMethodType = 'get' | 'post' | 'put' | 'delete' | 'patch'

type RouteDefinition = {
    path: string
    method: TMethodType
    handler: CustomRequestHandler
}

type CustomRequestHandler = RequestHandler & {
    __middleware?: RequestHandler[]
}

const UseMiddleware = (...middlewares: RequestHandler[]) => {
    return (target: any, propertyKey: string) => {
        const handler = target[propertyKey] as CustomRequestHandler
        if (!handler.__middleware) {
            handler.__middleware = []
        }
        handler.__middleware.push(...middlewares)
    }
}

const DecoratorRouter = Router()

const Controller = (basePath: string = '') => {
    return (target: any) => {
        const router = Router()
        const instance = new target()
        const routes: RouteDefinition[] = target.prototype.__routes || []

        routes.forEach(({ path, method, handler }) => {
            const boundHandler = handler.bind(instance)
            const middleware = handler.__middleware ? [...handler.__middleware, boundHandler] : [boundHandler]
            router[method](path, ...middleware)
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
                path: path.startsWith('/') ? path : `/${path}`,
                method,
                handler: target[propertyKey] as CustomRequestHandler // Cast to custom type
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
