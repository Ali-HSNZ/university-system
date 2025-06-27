import * as Yup from 'yup'
import { validateFile } from '../../core/validations'

const updateStudentValidation = Yup.object({
    first_name: Yup.string().required('نام الزامی است'),
    last_name: Yup.string().required('نام خانوادگی الزامی است'),
    phone: Yup.string().nullable(),
    email: Yup.string().email('ایمیل معتبر نیست').nullable(),
    address: Yup.string().nullable(),
    guardian_name: Yup.string().nullable(),
    guardian_phone: Yup.string().nullable(),
    student_status: Yup.string()
        .oneOf(['active', 'deActive', 'studying', 'graduate'], 'وضعیت دانشجویی معتبر نیست')
        .nullable(),
    military_status: Yup.string()
        .oneOf(['active', 'completed', 'exempted', 'postponed'], 'وضعیت نظام وظیفه معتبر نیست')
        .nullable(),
    avatar: validateFile({
        title: 'تصویر پروفایل',
        uniqueTitle: 'student-update-avatar',
        validTypes: ['png', 'jpg', 'jpeg', 'webp'],
        maxSize: 10 * 1024 * 1024,
        required: false
    }),
    national_card_image: validateFile({
        title: 'کارت ملی',
        uniqueTitle: 'student-update-national-card-image',
        validTypes: ['png', 'jpg', 'jpeg', 'webp', 'pdf'],
        maxSize: 10 * 1024 * 1024,
        required: false
    }),
    birth_certificate_image: validateFile({
        title: 'شناسنامه',
        uniqueTitle: 'student-update-birth-image',
        validTypes: ['png', 'jpg', 'jpeg', 'webp', 'pdf'],
        maxSize: 10 * 1024 * 1024,
        required: false
    }),
    military_service_image: validateFile({
        title: 'نظام وظیفه',
        uniqueTitle: 'student-update-military-image',
        validTypes: ['png', 'jpg', 'jpeg', 'webp', 'pdf'],
        maxSize: 10 * 1024 * 1024,
        required: false
    })
})

export { updateStudentValidation }
