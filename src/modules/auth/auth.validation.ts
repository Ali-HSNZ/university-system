import * as Yup from 'yup'
import { TUserRoleType, TUserGenderType } from './auth.types'

const registerValidation = (role: TUserRoleType, gender: TUserGenderType) =>
    Yup.object({
        first_name: Yup.string().max(100, 'نام باید حداکثر 100 کاراکتر باشد').optional(),
        last_name: Yup.string().max(100, 'نام خانوادگی باید حداکثر 100 کاراکتر باشد').optional(),
        national_code: Yup.string().length(10, 'کد ملی باید 10 رقم باشد').required('کد ملی الزامی است'),
        password: Yup.string()
            .min(6, 'رمز عبور باید حداقل 6 کاراکتر باشد')
            .max(32, 'رمز عبور باید حداکثر 32 کاراکتر باشد')
            .required('رمز عبور الزامی است'),
        role: Yup.string().oneOf(
            ['student', 'professor', 'education_assistant', 'university_president'],
            'نقش معتبر نیست'
        ),
        training_course_code: Yup.string().test(
            'check-training-course-code',
            'کد دوره آموزشی معتبر نیست',
            function (value) {
                if (role !== 'student') return true

                if (value) {
                    const validCodes = ['11', '22']
                    return validCodes.includes(value)
                }
                return false
            }
        ),
        gender: Yup.string().oneOf(['male', 'female'], 'جنسیت معتبر نیست').required('جنسیت الزامی است'),
        national_code_image: Yup.mixed()
            .required('فایل کارت ملی الزامی است')
            .test('national_code_image', 'فرمت فایل کارت ملی معتبر نیست', function (value) {
                if (!value) return false

                const file = value as Express.Multer.File
                const validTypes = ['png', 'jpg', 'jpeg', 'webp', 'pdf']
                const fileType = file.filename.split('.').pop() || ''
                const validFileType = validTypes.includes(fileType)
                if (!validFileType) {
                    return this.createError({
                        message: 'فرمت فایل کارت ملی معتبر نیست'
                    })
                }

                const maxSize = 10 * 1024 * 1024 // 10MB
                if (file.size > maxSize) {
                    return this.createError({
                        message: 'حداکثر حجم فایل کارت ملی 10 مگابایت است'
                    })
                }
                return true
            }),
        military_image: Yup.mixed().test('military_image', 'فایل نظام وظیفه الزامی است', function (value) {
            if (gender === 'female') return true

            // if user gender is male and military_image is not provided , return validation error
            if (!value) return false

            const file = value as Express.Multer.File

            const validTypes = ['png', 'jpg', 'jpeg', 'webp', 'pdf']
            const fileType = file.filename.split('.').pop() || ''
            const validFileType = validTypes.includes(fileType)
            if (!validFileType) {
                return this.createError({
                    message: 'فرمت فایل نظام وظیفه معتبر نیست'
                })
            }

            const maxSize = 10 * 1024 * 1024 // 10MB
            if (file.size > maxSize) {
                return this.createError({
                    message: 'حداکثر حجم فایل نظام وظیفه 10 مگابایت است'
                })
            }
            return true
        }),
        military_status: Yup.string().test('military_status', 'وضعیت نظام وظیفه معتبر نیست', function (value) {
            if (gender === 'female') return true

            if (value) {
                const validStatus = ['active', 'completed', 'exempted', 'postponed']
                return validStatus.includes(value)
            }
            return false
        }),
        phone: Yup.string().length(11, 'شماره تلفن باید 11 رقم باشد').optional(),
        email: Yup.string().email('ایمیل معتبر نیست').optional(),
        avatar: Yup.mixed().test('avatar', 'تصویر پروفایل الزامی است', function (value) {
            if (role !== 'student' && !value) return true

            if (!value) return false

            const file = value as Express.Multer.File

            const validTypes = ['png', 'jpg', 'jpeg', 'webp']
            const fileType = file.filename.split('.').pop() || ''
            const validFileType = validTypes.includes(fileType)
            if (!validFileType) {
                return this.createError({
                    message: 'فرمت تصویر پروفایل معتبر نیست'
                })
            }

            const maxSize = 10 * 1024 * 1024 // 10MB
            if (file.size > maxSize) {
                return this.createError({
                    message: 'حداکثر حجم تصویر پروفایل 10 مگابایت است'
                })
            }
            return true
        }),
        entry_date: Yup.date().test('check-entry-date', 'سال ورود معتبر نیست', function (value) {
            if (role !== 'student' && role !== 'professor') return true

            if (!value) return false

            return true
        }),
        degree_id: Yup.string().test('check-degree-id', 'شناسه مقطع تحصیلی معتبر نیست', function (value) {
            if (Number.isNaN(Number(value))) {
                return false
            }
            return true
        }),
        entry_semester: Yup.string().test('check-entry-semester', 'نیمسال ورود معتبر نیست', function (value) {
            if (role !== 'student') return true

            if (value) {
                const validSemester = ['1', '2']
                return validSemester.includes(value)
            }
            return false
        }),
        student_status: Yup.string().test('check-student-status', 'وضعیت دانشجویی معتبر نیست', function (value) {
            if (role !== 'student') {
                return true
            }
            if (value) {
                const validStatus = ['active', 'deActive', 'studying', 'graduate']
                return validStatus.includes(value)
            }
            return true
        }),
        department_id: Yup.string().test('check-department-id', 'شناسه گروه آموزشی معتبر نیست', function (value) {
            if (role !== 'professor' && role !== 'student') {
                return true
            }
            if (Number.isNaN(Number(value))) {
                return false
            }
            return true
        })
    })

export default registerValidation
