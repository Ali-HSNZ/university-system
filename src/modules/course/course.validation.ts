import * as yup from 'yup'

const createCourseSchema = yup.object().shape({
    name: yup
        .string()
        .required('نام درس الزامی است')
        .min(3, 'نام درس باید حداقل 3 کاراکتر باشد')
        .max(50, 'نام درس باید حداکثر 50 کاراکتر باشد'),
    theoretical_units: yup
        .string()
        .required('واحد نظری درس الزامی است')
        .test('is-number', 'واحد نظری باید عدد باشد', function (value) {
            console.log('value: ', value)

            // check if the value is a number
            if (Number.isNaN(Number(value))) return this.createError({ message: 'واحد نظری باید عدد باشد' })

            // check if the value is positive
            if (Number(value) < 0) return this.createError({ message: 'واحد نظری باید بیشتر از صفر باشد' })

            return true
        }),
    department_id: yup.string().test('is-number', 'گروه آموزشی باید عدد باشد', function (value) {
        if (Number.isNaN(Number(value))) return this.createError({ message: 'گروه آموزشی باید عدد باشد' })

        return true
    }),
    practical_units: yup
        .string()
        .required('واحد عملی درس الزامی است')
        .test('is-number', 'واحد عملی باید عدد باشد', function (value) {
            // check if the value is a number
            if (Number.isNaN(Number(value))) return this.createError({ message: 'واحد عملی باید عدد باشد' })

            // check if the value is positive
            if (Number(value) < 0) return this.createError({ message: 'واحد عملی باید بیشتر از صفر باشد' })

            return true
        }),
    type: yup.string().required('نوع درس الزامی است').oneOf(['theory', 'practical', 'combined'], 'نوع درس معتبر نیست'),
    prerequisites: yup.array().of(yup.string()).optional(),
    corequisites: yup.array().of(yup.string()).optional()
})

export default createCourseSchema
