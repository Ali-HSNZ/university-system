import { InferType } from 'yup'
import classScheduleSchema from './ClassSchedule.validation'

type TClassScheduleInferType = InferType<typeof classScheduleSchema>

export default TClassScheduleInferType
