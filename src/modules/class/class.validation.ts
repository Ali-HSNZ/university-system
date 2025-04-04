import * as yup from 'yup'

const classSchema = yup.object().shape({
    course_id: yup.string().test('is-valid-course-id', 'شناسه درس الزامی است', function (value) {
        if (!value) return this.createError({ path: this.path, message: 'شناسه درس الزامی است' })

        if (Number.isNaN(Number(value))) return this.createError({ path: this.path, message: 'شناسه درس معتبر نیست' })

        return true
    }),
    semester_id: yup.string().test('is-valid-semester-id', 'شناسه ترم الزامی است', function (value) {
        if (!value) return this.createError({ path: this.path, message: 'شناسه ترم الزامی است' })

        if (Number.isNaN(Number(value))) return this.createError({ path: this.path, message: 'شناسه ترم معتبر نیست' })

        return true
    }),
    capacity: yup.string().test('is-valid-capacity', 'ظرفیت الزامی است', function (value) {
        if (!value) return this.createError({ path: this.path, message: 'ظرفیت الزامی است' })

        if (Number.isNaN(Number(value))) return this.createError({ path: this.path, message: 'ظرفیت معتبر نیست' })

        if (Number(value) <= 0) return this.createError({ path: this.path, message: 'ظرفیت باید بیشتر از 0 باشد' })

        return true
    }),
    status: yup.string().test('is-valid-status', 'وضعیت الزامی است', function (value) {
        if (!value) return this.createError({ path: this.path, message: 'وضعیت الزامی است' })

        const validStatuses = ['open', 'closed', 'cancelled']
        if (!validStatuses.includes(value))
            return this.createError({ path: this.path, message: 'وضعیت معتبر نیست' })

        return true
    })
})

export default classSchema
