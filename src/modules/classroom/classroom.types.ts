import { InferType } from 'yup'
import classroomSchema from './classroom.validations'

type TClassroomInferType = InferType<typeof classroomSchema>

export default TClassroomInferType
