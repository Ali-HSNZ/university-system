import * as yup from 'yup'

const semesterSchema = yup.object().shape({
    academic_year: yup.string().test('academic_year', 'academic_year is required', function (value) {
        if (!value) return this.createError({ message: 'سال تحصیلی الزامی است' })

        const academicYearRegex = /^\d{4}-\d{4}$/
        if (!academicYearRegex.test(value)) {
            return this.createError({ message: 'فرمت سال تحصیلی صحیح نیست (مثال: YYYY-YYYY)' })
        }
        return true
    }),
    term_number: yup.number().test('term_number', 'term_number is required', function (value) {
        if (!value) return this.createError({ message: 'شماره ترم الزامی است' })
        if (value !== 1 && value !== 2) return this.createError({ message: 'شماره ترم باید 1 یا 2 باشد' })
        return true
    }),
    start_date: yup.string().test('start_date', 'start_date is required', function (value) {
        if (!value) return this.createError({ message: 'تاریخ شروع ترم الزامی است' })

        const startDateRegex = /^\d{4}-\d{2}-\d{2}$/
        if (!startDateRegex.test(value)) {
            return this.createError({ message: 'فرمت تاریخ شروع ترم صحیح نیست (مثال: YYYY-MM-DD)' })
        }
        return true
    }),
    end_date: yup.string().test('end_date', 'end_date is required', function (value) {
        if (!value) return this.createError({ message: 'تاریخ پایان ترم الزامی است' })

        const endDateRegex = /^\d{4}-\d{2}-\d{2}$/
        if (!endDateRegex.test(value)) {
            return this.createError({ message: 'فرمت تاریخ پایان ترم صحیح نیست (مثال: YYYY-MM-DD)' })
        }
        return true
    }),
    status: yup.string().test('status', 'status is required', function (value) {
        if (!value) return this.createError({ message: 'وضعیت ترم الزامی است' })
        const validStatuses = ['upcoming', 'ongoing', 'completed']
        if (!validStatuses.includes(value)) {
            return this.createError({ message: `وضعیت باید ${validStatuses.join(', ')} باشد` })
        }
        return true
    })
})

export default semesterSchema
