import { InferType } from "yup"
import courseSchema from "./course.validation"

type TCourseInferType = InferType<typeof courseSchema>

export default TCourseInferType
