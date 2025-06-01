import * as yup from 'yup'
import { TEnrollmentRequestBodyType, TEnrollmentUpdateRequestBodyType } from './educationAssistant.types'

const createEnrollmentValidation = yup.object<TEnrollmentRequestBodyType>().shape({
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
    data: yup
        .array()
        .of(
            yup.object().shape({
                id: yup.number().integer().positive().required(),
                status: yup
                    .string()
                    .oneOf(['approved_by_education_assistant', 'rejected_by_education_assistant'])
                    .required(),
                comment: yup.string()
            })
        )
        .required('داده‌ها الزامی است')
})

const studentIdValidation = yup.object().shape({
    userId: yup.number().integer().positive().required()
})

const classIdValidation = yup.object().shape({
    classId: yup.number().integer().positive().required()
})

export { createEnrollmentValidation, updateEnrollmentValidation, studentIdValidation, classIdValidation }
