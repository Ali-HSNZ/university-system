import * as Yup from 'yup'
import messages from './auth.messages'

const registerValidation = Yup.object({
    username: Yup.string()
        .min(3, messages.register.validation.username.min)
        .max(50, messages.register.validation.username.max)
        .optional(),
    password: Yup.string()
        .min(6, messages.register.validation.password.min)
        .required(messages.register.validation.password.required),
    national_id: Yup.string()
        .length(10, messages.register.validation.national_id)
        .required(messages.register.validation.national_id),
    role: Yup.string().required(messages.register.validation.role),
    full_name: Yup.string().max(100, messages.register.validation.full_name).optional(),
    email: Yup.string().email(messages.register.validation.email).optional(),
    entry_year: Yup.string().required(messages.register.validation.entry_year),
    degree_id: Yup.string().required(messages.register.validation.degree_id),
    department_id: Yup.string().required(messages.register.validation.department_id)
})

export default registerValidation
