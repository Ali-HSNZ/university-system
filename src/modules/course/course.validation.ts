import * as yup from 'yup'

const createCourseSchema = yup.object().shape({
    name: yup
        .string()
        .required('نام درس الزامی است')
        .min(3, 'نام درس باید حداقل 3 کاراکتر باشد')
        .max(50, 'نام درس باید حداکثر 50 کاراکتر باشد'),
    theory_unit: yup
        .string()
        .required('واحد نظری درس الزامی است')
        .test('is-number', 'واحد نظری باید عدد باشد', function (value) {
            // check if the value is a number
            if (Number.isNaN(Number(value))) return this.createError({ message: 'واحد نظری باید عدد باشد' })

            // check if the value is positive
            if (Number(value) < 0) return this.createError({ message: 'واحد نظری باید بیشتر از صفر باشد' })

            return true
        }),
    practical_unit: yup
        .string()
        .required('واحد عملی درس الزامی است')
        .test('is-number', 'واحد عملی باید عدد باشد', function (value) {
            // check if the value is a number
            if (Number.isNaN(Number(value))) return this.createError({ message: 'واحد عملی باید عدد باشد' })

            // check if the value is positive
            if (Number(value) < 0) return this.createError({ message: 'واحد عملی باید بیشتر از صفر باشد' })

            return true
        })
})

export default createCourseSchema
