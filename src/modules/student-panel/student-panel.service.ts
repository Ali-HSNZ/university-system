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
import { ProfessorModel } from '../../models/professor.model'
import { UserModel } from '../../models/user.model'
import { ClassroomModel } from '../../models/classroom.model'

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

    async currentSemesterCourses(semester_id: number, studentDTO: TStudentType) {
        const enrollments = await EnrollmentModel.findAll({
            where: { student_id: studentDTO.id },
            include: [
                {
                    model: ClassScheduleModel,
                    attributes: ['day_of_week', 'start_time', 'end_time'],
                    where: {
                        semester_id
                    },
                    include: [
                        {
                            model: ClassModel,
                            include: [{ model: CourseModel }]
                        },
                        {
                            model: ClassroomModel,
                            attributes: ['name', 'building_name', 'floor_number']
                        },
                        {
                            model: ProfessorModel,
                            attributes: ['id'],
                            include: [
                                {
                                    model: UserModel,
                                    attributes: ['first_name', 'last_name']
                                }
                            ]
                        }
                    ]
                }
            ]
        })

        const convertTime = (time: string) => {
            return time.split(':').slice(0, 2).join(':')
        }

        const dayOfWeekDictionary: Record<string, string> = {
            '0': 'شنبه',
            '1': 'یکشنبه',
            '2': 'دوشنبه',
            '3': 'سه شنبه',
            '4': 'چهارشنبه',
            '5': 'پنج شنبه',
            '6': 'جمعه'
        }

        const handleFloorNumber = (floor_number: string) => {
            if (floor_number?.toString() === '0') return 'همکف'
            return 'طبقه ' + floor_number
        }

        const courses = enrollments.map((enrollment: any) => {
            const classSchedule = enrollment.class_schedule
            const course = classSchedule?.class?.course
            const user = classSchedule?.professor?.user
            const classroom = classSchedule?.classroom

            return {
                name: course?.name,
                code: course?.code,
                theoretical_units: course?.theoretical_units,
                practical_units: course?.practical_units,
                day_of_week: dayOfWeekDictionary[classSchedule?.day_of_week],
                start_time: convertTime(classSchedule?.start_time),
                end_time: convertTime(classSchedule?.end_time),
                professor: {
                    name: user?.first_name + ' ' + user?.last_name
                },
                classroom: {
                    name: classroom?.name,
                    building_name: classroom?.building_name,
                    floor_number: handleFloorNumber(classroom?.floor_number)
                }
            }
        })

        return courses
    }
}

export default studentPanelService
