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
    student_code: Yup.string().nullable(),
    student_status: Yup.string().nullable(),
    total_passed_units: Yup.number().nullable(),
    high_school_diploma_id: Yup.number().nullable(),
    current_term_units: Yup.number().nullable(),
    probation_terms: Yup.number().nullable(),
    term_gpa: Yup.number().nullable(),
    total_gpa: Yup.number().nullable(),
    military_status: Yup.string().nullable(),
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

const registerProfessorValidation = Yup.object({
    first_name: Yup.string().required('نام الزامی است'),
    last_name: Yup.string().required('نام خانوادگی الزامی است'),
    professor_code: Yup.string().nullable(),
    national_code: Yup.string()
        .length(10, 'کد ملی باید 10 رقم باشد')
        .matches(/^\d+$/, 'کد ملی فقط میتواند شامل اعداد باشد')
        .required('کد ملی الزامی است'),
    gender: Yup.string().oneOf(['male', 'female'], 'جنسیت معتبر نیست').required('جنسیت الزامی است'),
    birth_date: Yup.string()
        .matches(/^\d{4}-\d{2}-\d{2}$/, 'فرمت تاریخ معتبر نیست')
        .required('تاریخ تولد الزامی است'),
    phone: Yup.string().nullable(),
    email: Yup.string().email('ایمیل معتبر نیست').nullable(),
    address: Yup.string().nullable(),
    research_interests: Yup.array().nullable(),
    office_phone: Yup.string().nullable(),
    office_address: Yup.string().nullable(),
    degree_id: Yup.string().test('degree-id', 'شناسه مقطع تحصیلی معتبر نیست', function (value) {
        if (!value) {
            return this.createError({ message: 'شناسه مقطع تحصیلی الزامی است' })
        }
        if (Number.isNaN(Number(value)) || Number(value) <= 0) {
            return this.createError({ message: 'شناسه مقطع تحصیلی معتبر نیست' })
        }
        return true
    }),
    department_id: Yup.string().test('department-id', 'شناسه گروه آموزشی معتبر نیست', function (value) {
        if (!value) {
            return this.createError({ message: 'شناسه گروه آموزشی الزامی است' })
        }
        if (Number.isNaN(Number(value)) || Number(value) <= 0) {
            return this.createError({ message: 'شناسه گروه آموزشی معتبر نیست' })
        }
        return true
    }),
    academic_rank: Yup.string()
        .oneOf(['instructor', 'assistant_professor', 'associate_professor', 'professor'], 'رتبه علمی معتبر نیست')
        .required('رتبه علمی الزامی است'),
    hire_date: Yup.string()
        .matches(/^\d{4}-\d{2}-\d{2}$/, 'فرمت تاریخ معتبر نیست')
        .required('تاریخ استخدام الزامی است'),
    specialization: Yup.string().nullable(),
    work_experience_years: Yup.number().required('سابقه کاری الزامی است').positive('سابقه کاری معتبر نیست'),
    avatar: validateFile({
        title: 'تصویر پروفایل',
        uniqueTitle: 'check-auth-student-avatar',
        validTypes: ['png', 'jpg', 'jpeg', 'webp'],
        maxSize: 10 * 1024 * 1024
    }),
    cv_file: validateFile({
        title: 'رزومه',
        uniqueTitle: 'check-auth-professor-cv-file',
        validTypes: ['pdf'],
        maxSize: 10 * 1024 * 1024,
        required: false
    }),
    employment_contract_file: validateFile({
        title: 'قرارداد کاری',
        uniqueTitle: 'check-auth-professor-employment-contract-file',
        validTypes: ['pdf'],
        maxSize: 10 * 1024 * 1024
    }),
    phd_certificate_file: validateFile({
        title: 'مدرک دکتری',
        uniqueTitle: 'check-auth-professor-phd-certificate-file',
        validTypes: ['pdf'],
        maxSize: 10 * 1024 * 1024
    }),
    national_card_file: validateFile({
        title: 'کارت ملی',
        uniqueTitle: 'check-auth-professor-national-card-file',
        validTypes: ['png', 'jpg', 'jpeg', 'webp', 'pdf'],
        maxSize: 10 * 1024 * 1024
    }),
    birth_certificate_file: validateFile({
        title: 'شناسنامه',
        uniqueTitle: 'check-auth-professor-birth-certificate-file',
        validTypes: ['png', 'jpg', 'jpeg', 'webp', 'pdf'],
        maxSize: 10 * 1024 * 1024
    }),
    military_service_file: validateFile({
        title: 'نظام وظیفه',
        uniqueTitle: 'check-auth-professor-military-service-file',
        validTypes: ['png', 'jpg', 'jpeg', 'webp', 'pdf'],
        maxSize: 10 * 1024 * 1024
    })
})

const loginValidation = Yup.object({
    national_code: Yup.string().length(10, 'کد ملی باید 10 رقم باشد').required('کد ملی الزامی است'),
    password: Yup.string()
        .min(6, 'رمز عبور باید حداقل 6 کاراکتر باشد')
        .max(32, 'رمز عبور باید حداکثر 32 کاراکتر باشد')
        .required('رمز عبور الزامی است')
})

export { loginValidation, registerStudentValidation, registerProfessorValidation }
