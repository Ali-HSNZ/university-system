import * as yup from 'yup'

const importantDateSchema = yup.object().shape({
    type: yup.string().required().oneOf(['enrollment', 'add_drop'], 'نوع اطلاع رسانی معتبر نیست'),
    start_date: yup.string().test('start_date', 'تاریخ شروع معتبر نیست', function (value) {
        if (!value) return false
        const regex = /^\d{4}\/\d{2}\/\d{2}$/
        return regex.test(value)
    }),
    start_time: yup.string().test('start_time', 'ساعت شروع معتبر نیست', function (value) {
        if (!value) return false
        const regex = /^\d{2}:\d{2}$/
        return regex.test(value)
    }),
    end_date: yup.string().test('end_date', 'تاریخ پایان معتبر نیست', function (value) {
        if (!value) return false
        const regex = /^\d{4}\/\d{2}\/\d{2}$/
        return regex.test(value)
    }),
    end_time: yup.string().test('end_time', 'ساعت پایان معتبر نیست', function (value) {
        if (!value) return false
        const regex = /^\d{2}:\d{2}$/
        return regex.test(value)
    }),
    entry_year: yup.number().required('سال ورود الزامی است'),
    department_id: yup.number().required('شناسه گروه آموزشی الزامی است'),
    degree_id: yup.number().required('شناسه مقطع تحصیلی الزامی است'),
    study_id: yup.number().required('شناسه رشته تحصیلی الزامی است')
})

export default importantDateSchema
