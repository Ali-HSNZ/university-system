import { InferType } from 'yup'
import { classSchema, updateClassSchema } from './class.validation'

type TClassInferType = InferType<typeof classSchema>
type TUpdateClassInferType = InferType<typeof updateClassSchema>

export { TUpdateClassInferType, TClassInferType }
