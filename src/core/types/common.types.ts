// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TCriticalAnyType = any

type TResponseMethodType = {
    statusCode: number
    message?: string
    data?: TCriticalAnyType
}

export { TResponseMethodType, TCriticalAnyType }

