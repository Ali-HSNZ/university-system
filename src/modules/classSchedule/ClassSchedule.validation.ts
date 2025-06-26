import * as yup from 'yup'

const classScheduleSchema = yup.object().shape({
    class_id: yup.string().test('class_id', 'شناسه کلاس الزامی است', function (value) {
        if (!value) return this.createError({ message: 'شناسه کلاس الزامی است' })
        if (isNaN(Number(value))) return this.createError({ message: 'شناسه کلاس بایستی عددی باشد' })
        return true
    }),
    classroom_id: yup.string().test('classroom_id', 'شناسه سالن لزامی است', function (value) {
        if (!value) return this.createError({ message: 'شناسه سالن الزامی است' })
        if (isNaN(Number(value))) return this.createError({ message: 'شناسه سالن بایستی عددی باشد' })
        return true
    }),

    professor_id: yup.string().test('professor_id', 'شناسه استاد الزامی است', function (value) {
        if (!value) return this.createError({ message: 'شناسه استاد الزامی است' })
        if (isNaN(Number(value))) return this.createError({ message: 'شناسه استاد بایستی عددی باشد' })
        return true
    }),
    day_of_week: yup
        .string()
        .required('روز هفته الزامی است')
        .oneOf(['0', '1', '2', '3', '4', '5', '6'], 'روز هفته معتبر نیست'),
    start_time: yup.string().test('start_time', 'ساعت شروع الزامی است', function (value) {
        if (!value) return this.createError({ message: 'ساعت شروع الزامی است' })

        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/

        if (!timeRegex.test(value)) return this.createError({ message: 'ساعت شروع بایستی به صورت ساعت:دقیقه باشد' })
        return true
    }),
    end_time: yup.string().test('end_time', 'ساعت پایان الزامی است', function (value) {
        if (!value) return this.createError({ message: 'ساعت پایان الزامی است' })

        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
        if (!timeRegex.test(value)) return this.createError({ message: 'ساعت پایان بایستی به صورت ساعت:دقیقه باشد' })
        return true
    })
})

const classScheduleUpdateSchema = yup.object().shape({
    course_name: yup.string().optional(),
    class_id: yup.string().optional().test('class_id', 'شناسه کلاس بایستی عددی باشد', function (value) {
        if (value && isNaN(Number(value))) return this.createError({ message: 'شناسه کلاس بایستی عددی باشد' })
        return true
    }),
    classroom_id: yup.string().optional().test('classroom_id', 'شناسه سالن بایستی عددی باشد', function (value) {
        if (value && isNaN(Number(value))) return this.createError({ message: 'شناسه سالن بایستی عددی باشد' })
        return true
    }),
    professor_id: yup.string().optional().test('professor_id', 'شناسه استاد بایستی عددی باشد', function (value) {
        if (value && isNaN(Number(value))) return this.createError({ message: 'شناسه استاد بایستی عددی باشد' })
        return true
    }),
    day_of_week: yup
        .string()
        .optional()
        .oneOf(['0', '1', '2', '3', '4', '5', '6'], 'روز هفته معتبر نیست'),
    start_time: yup.string().optional().test('start_time', 'ساعت شروع بایستی به صورت ساعت:دقیقه باشد', function (value) {
        if (value) {
            const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
            if (!timeRegex.test(value)) return this.createError({ message: 'ساعت شروع بایستی به صورت ساعت:دقیقه باشد' })
        }
        return true
    }),
    end_time: yup.string().optional().test('end_time', 'ساعت پایان بایستی به صورت ساعت:دقیقه باشد', function (value) {
        if (value) {
            const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
            if (!timeRegex.test(value)) return this.createError({ message: 'ساعت پایان بایستی به صورت ساعت:دقیقه باشد' })
        }
        return true
    })
})

export default classScheduleSchema
export { classScheduleUpdateSchema }
