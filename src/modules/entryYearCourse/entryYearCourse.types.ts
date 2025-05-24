import * as Yup from 'yup'
import entryYearCourseValidation from './entryYearCourse.validations'

type TEntryYearCourseBodyInferType = Yup.InferType<typeof entryYearCourseValidation>

type TEntryYearCourseGroupedType = {
    id: number
    year: string
    department: { id: number; name: string }
    degree: { id: number; name: string }
    study: { id: number; name: string }
    courses: {
        id: number
        name: string
        code: string
        theoretical_units: number
        practical_units: number
        type: string
        prerequisites: string[]
        corequisites: string[]
    }[]
}

export { TEntryYearCourseBodyInferType, TEntryYearCourseGroupedType }
