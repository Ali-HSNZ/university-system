import { InferType } from 'yup'
import importantDateSchema from './importantDate.validation'

type TImportantDateInferType = InferType<typeof importantDateSchema>

export default TImportantDateInferType
