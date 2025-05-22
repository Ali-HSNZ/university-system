import * as yup from 'yup'
import { TEnrollmentRequestBodyType, TEnrollmentUpdateRequestBodyType } from './enrollment.types'

const createEnrollmentValidation = yup.object<TEnrollmentRequestBodyType>().shape({
    student_id: yup
        .number()
        .integer('شناسه دانشجو بایستی یک عدد صحیح باشد')
        .positive('شناسه دانشجو بایستی یک عدد صحیح مثبت باشد')
        .required('شناسه دانشجو الزامی است'),
    class_schedule_ids: yup
        .array()
        .of(
            yup
                .number()
                .integer('شناسه برنامه جلسه بایستی یک عدد صحیح باشد')
                .positive('شناسه برنامه جلسه بایستی یک عدد صحیح مثبت باشد')
        )
        .min(1, 'حداقل یک برنامه جلسه باید انتخاب شود')
        .required('شناسه‌های برنامه جلسه الزامی است')
})

const updateEnrollmentValidation = yup.object<TEnrollmentUpdateRequestBodyType>().shape({
    status: yup.string().oneOf(['pending', 'approved', 'rejected']).required()
})

const studentIdValidation = yup.object().shape({
    userId: yup.number().integer().positive().required()
})

const classIdValidation = yup.object().shape({
    classId: yup.number().integer().positive().required()
})

export { createEnrollmentValidation, updateEnrollmentValidation, studentIdValidation, classIdValidation }
