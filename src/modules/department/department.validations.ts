import * as Yup from 'yup'

const createDepartmentValidation = Yup.object({
    name: Yup.string()
        .required('نام گروه آموزشی الزامی است')
        .min(3, 'نام گروه آموزشی باید حداقل 3 کاراکتر باشد')
        .max(100, 'نام گروه آموزشی باید حداکثر 100 کاراکتر باشد')
        .test('is-valid-name', 'این گروه آموزشی قبلا ثبت شده است', function (value) {
            if (value.length < 3) {
                return this.createError({
                    message: 'نام گروه آموزشی باید حداقل 3 کاراکتر باشد'
                })
            }
            if (value.length > 100) {
                return this.createError({
                    message: 'نام گروه آموزشی باید حداکثر 100 کاراکتر باشد'
                })
            }

            if (!Number.isNaN(Number(value))) {
                return this.createError({
                    message: 'نام گروه آموزشی نامعتبر است'
                })
            }
            return true
        })
})

export { createDepartmentValidation }
