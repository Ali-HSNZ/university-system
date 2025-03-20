import { Router, RequestHandler } from 'express'

type TMethodType = 'get' | 'post' | 'put' | 'delete' | 'patch'

type RouteDefinition = {
    path: string
    method: TMethodType
    handler: RequestHandler
}

const DecoratorRouter = Router()

const Controller = (basePath: string = '') => {
    return (target: any) => {
        const router = Router()
        const instance = new target()
        const routes: RouteDefinition[] = target.prototype.__routes || []

        routes.forEach(({ path, method, handler }) => {
            router[method](path, handler.bind(instance))
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
                handler: target[propertyKey]
            })
        }
    }

const Get = createMethodDecorator('get')
const Post = createMethodDecorator('post')
const Put = createMethodDecorator('put')
const Delete = createMethodDecorator('delete')
const Patch = createMethodDecorator('patch')

export default DecoratorRouter

export { Controller, Get, Post, Put, Delete, Patch }
