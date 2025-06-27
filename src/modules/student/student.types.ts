import { InferType } from 'yup'
import { updateStudentValidation } from '../auth/auth.validation'
type TUpdateStudentInferType = InferType<typeof updateStudentValidation>

type TUpdateStudentFilesType = {
    avatar?: Express.Multer.File[]
    national_card_image?: Express.Multer.File[]
    birth_certificate_image?: Express.Multer.File[]
    military_service_image?: Express.Multer.File[]
}

export { TUpdateStudentInferType, TUpdateStudentFilesType }
