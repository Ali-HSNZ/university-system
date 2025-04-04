import * as yup from 'yup'

const classProfessorSchema = yup.object().shape({
    class_id: yup.string().test('class_id', 'شناسه کلاس معتبر نیست', function (value) {
        if (!value) return this.createError({ message: 'شناسه کلاس الزامی است' })

        if (Number.isNaN(Number(value))) return this.createError({ message: 'شناسه کلاس بایستی یک عدد باشد' })

        if (Number(value) <= 0) return this.createError({ message: 'شناسه کلاس بایستی بزرگتر از صفر باشد' })

        return true
    }),
    professor_id: yup.string().test('professor_id', 'شناسه استاد معتبر نیست', function (value) {
        if (!value) return this.createError({ message: 'شناسه استاد الزامی است' })

        if (Number.isNaN(Number(value))) return this.createError({ message: 'شناسه استاد بایستی یک عدد باشد' })

        if (Number(value) <= 0) return this.createError({ message: 'شناسه استاد بایستی بزرگتر از صفر باشد' })

        return true
    })
})

export default classProfessorSchema
