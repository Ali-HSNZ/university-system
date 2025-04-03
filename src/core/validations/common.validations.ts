import * as Yup from 'yup'
import TValidateFileType from './common.validations.types'

const validateFile = ({ validTypes, maxSize, title, uniqueTitle, required = true }: TValidateFileType) =>
    Yup.mixed().test(uniqueTitle, `فرمت ${title} معتبر نیست`, function (value) {
        if (!required && !value) return true
        if (!value) return this.createError({ message: `${title} الزامی است` })

        const file = value as Express.Multer.File
        if (!file || !file.originalname) return this.createError({ message: `${title} نامعتبر است` })

        const fileType = file.originalname.split('.').pop()?.toLowerCase() || ''
        if (!validTypes.includes(fileType)) {
            return this.createError({ message: `می باشد ${validTypes.join(', ')} ،فرمت مجاز برای ${title} ` })
        }

        if (file.size > maxSize) {
            return this.createError({
                message: `حداکثر حجم ${title} ${maxSize / (1024 * 1024)} مگابایت است`
            })
        }

        return true
    })

export { validateFile }
