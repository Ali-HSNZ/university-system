import * as Yup from 'yup'

const entryYearCourseValidation = Yup.object().shape({
    entry_year_id: Yup.string().test('entry_year_id', 'شناسه سال ورود الزامی می باشد', function (value) {
        if (!value) return this.createError({ message: 'شناسه سال ورود الزامی می باشد' })

        if (isNaN(Number(value))) return this.createError({ message: 'شناسه سال ورود بایستی عدد باشد' })

        return true
    }),
    course_id: Yup.string().test('course_id', 'شناسه درس الزامی می باشد', function (value) {
        if (!value) return this.createError({ message: 'شناسه درس الزامی می باشد' })

        if (isNaN(Number(value))) return this.createError({ message: 'شناسه درس بایستی عدد باشد' })

        return true
    })
})

export default entryYearCourseValidation
