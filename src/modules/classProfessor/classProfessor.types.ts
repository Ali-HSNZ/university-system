import { InferType } from 'yup'
import classProfessorSchema from './classProfessor.validation'

type TClassProfessorInferType = InferType<typeof classProfessorSchema>

export default TClassProfessorInferType
