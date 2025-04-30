import * as Yup from 'yup'
import entryYearValidation from './entry-year.validations'
type TEntryYearBodyInferType = Yup.InferType<typeof entryYearValidation>

export default TEntryYearBodyInferType
