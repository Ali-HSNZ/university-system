import * as Yup from 'yup'
import { validateFile } from '../../core/validations'

const registerStudentValidation = Yup.object({
    first_name: Yup.string().required('نام الزامی است'),
    last_name: Yup.string().required('نام خانوادگی الزامی است'),
    national_code: Yup.string()
        .length(10, 'کد ملی باید 10 رقم باشد')
        .matches(/^\d+$/, 'کد ملی فقط میتواند شامل اعداد باشد')
        .required('کد ملی الزامی است'),
    gender: Yup.string().oneOf(['male', 'female'], 'جنسیت معتبر نیست').required('جنسیت الزامی است'),
    guardian_name: Yup.string().nullable(),
    guardian_phone: Yup.string().nullable(),
    school_name: Yup.string().nullable(),
    diploma_date: Yup.string()
        .matches(/^\d{4}-\d{2}-\d{2}$/, 'فرمت تاریخ معتبر نیست')
        .required('تاریخ آخرین اخذ مدارک دانشگاهی الزامی است'),
    birth_date: Yup.string()
        .matches(/^\d{4}-\d{2}-\d{2}$/, 'فرمت تاریخ معتبر نیست')
        .required('تاریخ تولد الزامی است'),
    phone: Yup.string().nullable(),
    email: Yup.string().email('ایمیل معتبر نیست').nullable(),
    pre_degree_id: Yup.number()
        .optional()
        .positive('شناسه آخرین مدرک تحصیلی معتبر نیست')
        .integer('شناسه آخرین مدرک تحصیلی باید یک عدد صحیح باشد'),
    address: Yup.string().nullable(),
    avatar: validateFile({
        title: 'تصویر پروفایل',
        uniqueTitle: 'check-auth-student-avatar',
        validTypes: ['png', 'jpg', 'jpeg', 'webp'],
        maxSize: 10 * 1024 * 1024
    }),
    national_card_image: validateFile({
        title: 'کارت ملی',
        uniqueTitle: 'check-auth-student-national-card-image',
        validTypes: ['png', 'jpg', 'jpeg', 'webp', 'pdf'],
        maxSize: 10 * 1024 * 1024
    }),
    birth_certificate_image: validateFile({
        title: 'شناسنامه',
        uniqueTitle: 'student-birth-image',
        validTypes: ['png', 'jpg', 'jpeg', 'webp', 'pdf'],
        maxSize: 10 * 1024 * 1024
    }),
    military_service_image: validateFile({
        title: 'نظام وظیفه',
        uniqueTitle: 'student-military-image',
        validTypes: ['png', 'jpg', 'jpeg', 'webp', 'pdf'],
        maxSize: 10 * 1024 * 1024
    }),
    department_id: Yup.number().required('شناسه گروه آموزشی الزامی است'),
    entry_year: Yup.number().required('سال ورود الزامی است'),
    entry_semester: Yup.string().oneOf(['1', '2'], 'نیمسال ورود معتبر نیست').required('نیمسال ورود الزامی است')
})

const loginValidation = Yup.object({
    national_code: Yup.string().length(10, 'کد ملی باید 10 رقم باشد').required('کد ملی الزامی است'),
    password: Yup.string()
        .min(6, 'رمز عبور باید حداقل 6 کاراکتر باشد')
        .max(32, 'رمز عبور باید حداکثر 32 کاراکتر باشد')
        .required('رمز عبور الزامی است')
})

export { loginValidation, registerStudentValidation }
