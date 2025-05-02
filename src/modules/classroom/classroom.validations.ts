import * as Yup from 'yup'

const classroomSchema = Yup.object().shape({
    name: Yup.string().required('نام سالن الزامی است'),
    building_name: Yup.string().required('نام ساختمان الزامی است'),
    floor_number: Yup.string().required('شماره طبقه الزامی است'),
    capacity: Yup.number().required('ظرفیت الزامی است')
})

export default classroomSchema
