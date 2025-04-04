import * as yup from 'yup'

const importantDateSchema = yup.object().shape({
    type: yup.string().required().oneOf(['course_selection', 'add_drop'], 'نوع اطلاع رسانی معتبر نیست'),
    start_date: yup.date().required('تاریخ شروع الزامی است'),
    end_date: yup.date().required('تاریخ پایان الزامی است'),
    entry_year: yup.number().required('سال ورود الزامی است'),
    department_id: yup.number().required('شناسه گروه آموزشی الزامی است')
})

export default importantDateSchema
