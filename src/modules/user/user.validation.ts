import * as Yup from 'yup'
import { TUserGenderType } from '../auth/auth.types'
import { TUserRoleType } from '../auth/auth.types'

const updateUserValidation = (role: TUserRoleType, gender: TUserGenderType) =>
    Yup.object({
        first_name: Yup.string().max(100, 'نام باید حداکثر 100 کاراکتر باشد').optional(),
        last_name: Yup.string().max(100, 'نام خانوادگی باید حداکثر 100 کاراکتر باشد').optional(),
        password: Yup.string()
            .min(6, 'رمز عبور باید حداقل 6 کاراکتر باشد')
            .max(32, 'رمز عبور باید حداکثر 32 کاراکتر باشد')
            .required('رمز عبور الزامی است'),
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

export default updateUserValidation
