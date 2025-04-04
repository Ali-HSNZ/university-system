import { InferType } from 'yup'
import classSchema from './class.validation'

type TClassInferType = InferType<typeof classSchema>

export default TClassInferType
