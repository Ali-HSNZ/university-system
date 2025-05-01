import { TStudentType } from '../../core/types/student'
import { TUserType } from '../../core/types/user'
import moment from 'moment-jalaali'
import degreeServices from '../degree/degree.service'
import studyServices from '../study/study.service'
import departmentServices from '../department/department.service'
import enrollmentService from '../enrollment/enrollment.service'
import { EnrollmentModel } from '../../models/enrollment.model'
import { ClassScheduleModel } from '../../models/classSchedule.model'
import { ClassModel } from '../../models/class.model'
import { CourseModel } from '../../models/course.model'
import { SemesterModel } from '../../models/semester.model'
import { GradeModel } from '../../models/grade.model'

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

        const studentStatusDictionary: Record<string, string> = {
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
    },

    async currentSemesterCourses(studentDTO: TStudentType) {
        const enrollments = await EnrollmentModel.findAll({
            where: { student_id: studentDTO.id },
            include: [
                {
                    model: ClassScheduleModel,
                    include: [
                        {
                            model: ClassModel,
                            include: [{ model: CourseModel }]
                        }
                    ]
                }
            ]
        })

        const currentSemester = await enrollmentService.getCurrentSemesterForStudent(studentDTO.id)
        const currentSemesterId = currentSemester[0]?.id

        const courses = enrollments
            .filter((enrollment: any) => enrollment.class_schedule?.class?.semester?.id === currentSemesterId)
            .map((enrollment: any) => ({
                course: {
                    id: enrollment.class_schedule?.class?.course?.id,
                    name: enrollment.class_schedule?.class?.course?.name,
                    code: enrollment.class_schedule?.class?.course?.code,
                    theoretical_units: enrollment.class_schedule?.class?.course?.theoretical_units,
                    practical_units: enrollment.class_schedule?.class?.course?.practical_units
                },
                grade: {
                    midterm_score: enrollment.grade?.midterm_score,
                    final_score: enrollment.grade?.final_score,
                    total_score: enrollment.grade?.total_score
                }
            }))

        return {
            semester: currentSemester[0],
            courses
        }
    }
}

export default studentPanelService
