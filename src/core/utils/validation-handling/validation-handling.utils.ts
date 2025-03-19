import { ValidationError, ObjectSchema } from 'yup'

const validationHandling = async <T extends Record<string, any>>(data: T, schema: ObjectSchema<T>) => {
    try {
        return await schema.validate(data, { abortEarly: false })
    } catch (error) {
        if (error instanceof ValidationError) {
            throw new ValidationError(error)
        } else {
            throw new Error('خطایی نامشخصsdv رخ داده است')
        }
    }
}

export default validationHandling
