import * as Yup from 'yup'
import { validateFile } from '../../core/validations/common.validations'

const updateUserValidation = Yup.object({
    first_name: Yup.string().required('نام الزامی است'),
    last_name: Yup.string().required('نام خانوادگی الزامی است'),
    national_code: Yup.string()
        .length(10, 'کد ملی باید 10 رقم باشد')
        .matches(/^\d+$/, 'کد ملی فقط میتواند شامل اعداد باشد')
        .required('کد ملی الزامی است'),
    gender: Yup.string().oneOf(['male', 'female'], 'جنسیت معتبر نیست').required('جنسیت الزامی است'),
    birth_date: Yup.string()
        .matches(/^\d{4}\/\d{2}\/\d{2}$/, 'فرمت تاریخ معتبر نیست')
        .required('تاریخ تولد الزامی است'),
    phone: Yup.string().nullable(),
    email: Yup.string().email('ایمیل معتبر نیست').nullable(),
    password: Yup.string()
        .trim()
        .test('password-test', 'رمز عبور الزامی است', function (value) {
            if (!value || value.length === 0) return true

            const validPassword = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(value)
            if (!validPassword) return this.createError({ message: 'رمز عبور نامعتبر است' })

            return true
        }),
    address: Yup.string().nullable(),
    avatar: validateFile({
        title: 'تصویر پروفایل',
        uniqueTitle: 'check-user-avatar',
        validTypes: ['png', 'jpg', 'jpeg', 'webp'],
        maxSize: 10 * 1024 * 1024,
        required: false
    })
})

const updateUserPasswordValidation = Yup.object({
    current_password: Yup.string().trim().required('رمز عبور فعلی الزامی است'),
    password: Yup.string()
        .trim()
        .test('edit-password-test', 'کلمه عبور باید کمتر از 32 کاراکتر باشد', function (value) {
            if (value && value.length > 32)
                return this.createError({ message: 'کلمه عبور باید کمتر از 32 کاراکتر باشد' })
            return true
        }),
    confirm_password: Yup.string()
        .trim()
        .test('confirm-password-test', 'کلمه عبور باید کمتر از 32 کاراکتر باشد', function (value) {
            if (value !== this.parent.password)
                return this.createError({ message: 'کلمه عبور باید کمتر از 32 کاراکتر باشد' })

            if (value && value.length > 32)
                return this.createError({ message: 'کلمه عبور باید کمتر از 32 کاراکتر باشد' })
            return true
        })
})
export { updateUserValidation, updateUserPasswordValidation }
