import * as Yup from 'yup'
import entryYearValidation from './entryYear.validations'
type TEntryYearBodyInferType = Yup.InferType<typeof entryYearValidation>

export default TEntryYearBodyInferType
