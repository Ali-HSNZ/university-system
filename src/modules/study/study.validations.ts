import * as Yup from 'yup'

const studyValidation = Yup.object({
    name: Yup.string()
        .required('نام رشته تحصیلی الزامی است')
        .test('is-valid-name', 'این رشته تحصیلی قبلا ثبت شده است', function (value) {
            if (value.length < 3) {
                return this.createError({
                    message: 'نام رشته تحصیلی باید حداقل 3 کاراکتر باشد'
                })
            }
            if (value.length > 100) {
                return this.createError({
                    message: 'نام رشته تحصیلی باید حداکثر 100 کاراکتر باشد'
                })
            }

            if (!Number.isNaN(Number(value))) {
                return this.createError({
                    message: 'نام رشته تحصیلی نامعتبر است'
                })
            }
            return true
        }),
    description: Yup.string().max(500, 'توضیحات باید حداکثر 500 کاراکتر باشد')
})

export default studyValidation
