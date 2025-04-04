import { RequestHandler } from 'express'

type TMethodType = 'get' | 'post' | 'put' | 'delete' | 'patch'

type CustomRequestHandler = RequestHandler & {
    __middleware?: RequestHandler[]
}
type RouteDefinition = {
    path: string
    method: TMethodType
    handler: CustomRequestHandler
}

type TAuthenticateMiddlewareWhitelist = {
    method: TMethodType
    path: string
}[]

export { TMethodType, CustomRequestHandler, RouteDefinition, TAuthenticateMiddlewareWhitelist }
