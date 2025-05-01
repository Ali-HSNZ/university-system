import { TStudentType } from '../../core/types/student'
import { TUserType } from '../../core/types/user'
import moment from 'moment-jalaali'
import degreeServices from '../degree/degree.service'
import studyServices from '../study/study.service'
import departmentServices from '../department/department.service'
import enrollmentService from '../enrollment/enrollment.service'

const studentPanelService = {
    async profile({ studentDTO, userDTO }: { studentDTO: TStudentType; userDTO: TUserType }) {
        return {
            name: `${userDTO.first_name} ${userDTO.last_name}`,
            student_code: studentDTO.student_code,
            national_code: userDTO.national_code,
            gender: userDTO.gender === 'male' ? 'آقا' : 'خانم',
            birth_date: moment(userDTO.birth_date, 'YYYY-MM-DD').format('jYYYY/jMM/jDD'),
            phone: userDTO.phone,
            email: userDTO.email,
            address: userDTO.address,
            avatar: userDTO.avatar
        }
    },

    async educationInformation(studentDTO: TStudentType) {
        const degree = await degreeServices.getDegreeNameById(studentDTO.degree_id)
        const study = await studyServices.getStudyNameById(studentDTO.study_id)
        const department = await departmentServices.getDepartmentNameById(studentDTO.department_id)

        const currentSemester = await enrollmentService.getCurrentSemesterForStudent(studentDTO.id)

        const studentStatusDictionary = {
            active: 'فعال',
            deActive: 'غیرفعال',
            studying: 'در حال تحصیل',
            graduate: 'فارغ‌التحصیل'
        }

        return {
            status: studentStatusDictionary[studentDTO.student_status],
            degree: degree?.dataValues?.name,
            study: study?.dataValues?.name,
            department: department?.dataValues?.name,
            entry_year: moment(studentDTO.entry_year, 'YYYY').format('jYYYY'),
            current_semester: currentSemester
        }
    }
}

export default studentPanelService
