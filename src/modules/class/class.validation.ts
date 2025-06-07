import * as yup from 'yup'

const classSchema = yup.object().shape({
    course_id: yup.string().test('is-valid-course-id', 'شناسه درس الزامی است', function (value) {
        if (!value) return this.createError({ path: this.path, message: 'شناسه درس الزامی است' })

        if (Number.isNaN(Number(value))) return this.createError({ path: this.path, message: 'شناسه درس معتبر نیست' })

        return true
    }),
    status: yup.string().test('is-valid-status', 'وضعیت الزامی است', function (value) {
        if (!value) return this.createError({ path: this.path, message: 'وضعیت الزامی است' })

        const validStatuses = ['open', 'closed', 'canceled']
        if (!validStatuses.includes(value)) return this.createError({ path: this.path, message: 'وضعیت معتبر نیست' })

        return true
    })
})

const updateClassSchema = yup.object().shape({
    status: yup.string().test('is-valid-status', 'وضعیت الزامی است', function (value) {
        if (!value) return this.createError({ path: this.path, message: 'وضعیت الزامی است' })

        const validStatuses = ['open', 'closed', 'canceled']
        if (!validStatuses.includes(value)) return this.createError({ path: this.path, message: 'وضعیت معتبر نیست' })

        return true
    })
})

export { classSchema, updateClassSchema }
