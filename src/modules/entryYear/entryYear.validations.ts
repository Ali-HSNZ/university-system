import * as Yup from 'yup'

const entryYearValidation = Yup.object().shape({
    year: Yup.string().test('year', 'سال الزامی می باشد', function (value) {
        if (!value) return this.createError({ message: 'سال الزامی می باشد' })

        if (isNaN(Number(value))) return this.createError({ message: 'سال بایستی عدد باشد' })

        if (value.length !== 4) return this.createError({ message: 'سال بایستی 4 رقمی باشد' })

        return true
    }),
    degree_id: Yup.string().test('degree_id', 'شناسه رشته الزامی می باشد', function (value) {
        if (!value) return this.createError({ message: 'شناسه رشته الزامی می باشد' })

        if (isNaN(Number(value))) return this.createError({ message: 'شناسه رشته بایستی عدد باشد' })

        return true
    }),
    department_id: Yup.string().test('department_id', 'شناسه گروه آموزشی الزامی می باشد', function (value) {
        if (!value) return this.createError({ message: 'شناسه گروه آموزشی الزامی می باشد' })

        if (isNaN(Number(value))) return this.createError({ message: 'شناسه گروه آموزشی بایستی عدد باشد' })

        return true
    })
})

export default entryYearValidation
