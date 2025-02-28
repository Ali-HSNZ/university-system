import { Router } from 'express'

import { type TCriticalAnyType } from '../core/types/common.types'

const DecoratorRouter: Router = Router()

const Get = (path?: string) => {
    return (target: TCriticalAnyType, propertyKey: string) => {
        const route = path ? (path?.[0] === '/' ? path : `/${path}`) : `/${propertyKey}`
        DecoratorRouter.get(route, target[propertyKey])
    }
}

const Post = (path?: string) => {
    return (target: TCriticalAnyType, propertyKey: string) => {
        const route = path ? (path?.[0] === '/' ? path : `/${path}`) : `/${propertyKey}`
        DecoratorRouter.post(route, target[propertyKey])
    }
}

const Put = (path?: string) => {
    return (target: TCriticalAnyType, propertyKey: string) => {
        const route = path ? (path?.[0] === '/' ? path : `/${path}`) : `/${propertyKey}`
        DecoratorRouter.put(route, target[propertyKey])
    }
}

const Delete = (path?: string) => {
    return (target: TCriticalAnyType, propertyKey: string) => {
        const route = path ? (path?.[0] === '/' ? path : `/${path}`) : `/${propertyKey}`
        DecoratorRouter.delete(route, target[propertyKey])
    }
}

const Patch = (path?: string) => {
    return (target: TCriticalAnyType, propertyKey: string) => {
        const route = path ? (path?.[0] === '/' ? path : `/${path}`) : `/${propertyKey}`
        DecoratorRouter.patch(route, target[propertyKey])
    }
}

const Controller = (controllerPath?: string) => {
    return (target: TCriticalAnyType) => {
        if (controllerPath?.[0] !== '/') controllerPath = `/${controllerPath}`
        const path = controllerPath || '/'
        DecoratorRouter.use(path, DecoratorRouter)
    }
}

export default DecoratorRouter

export { Controller, Get, Post, Put, Delete, Patch }
