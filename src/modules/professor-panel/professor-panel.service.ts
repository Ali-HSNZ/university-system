import { ClassScheduleModel } from '../../models/classSchedule.model'
import { ClassModel } from '../../models/class.model'
import { CourseModel } from '../../models/course.model'
import { SemesterModel } from '../../models/semester.model'
import { ClassroomModel } from '../../models/classroom.model'
import { EnrollmentModel } from '../../models/enrollment.model'
import { StudentModel } from '../../models/student.model'
import { UserModel } from '../../models/user.model'
import { Model } from 'sequelize'
import degreeServices from '../degree/degree.service'
import departmentServices from '../department/department.service'
import studyServices from '../study/study.service'
import { TProfessorType } from '../../core/types/professor'
import { TUserType } from '../../core/types/user'

interface IClassSchedule extends Model {
    id: number
    class: {
        course: {
            id: number
            name: string
            code: string
            theoretical_units: number
            practical_units: number
        }
        enrolled_students: number
        status: string
    }
    semester: {
        id: number
        academic_year: string
        term_number: string
        start_date: string
        end_date: string
        status: string
    }
    classroom: {
        name: string
        building_name: string
        floor_number: number
        capacity: number
    }
}

const professorPanelService = {
    profile: async ({ professorDTO, userDTO }: { professorDTO: TProfessorType; userDTO: TUserType }) => {
        const degree = await degreeServices.getDegreeNameById(professorDTO.degree_id)
        const department = await departmentServices.getDepartmentNameById(professorDTO.department_id)
        const study = await studyServices.getStudyNameById(professorDTO.study_id)

        const academicRankDictionary = {
            instructor: 'مربی',
            assistant_professor: 'استادیار',
            associate_professor: 'دانشیار',
            professor: 'استاد'
        }

        const statusDictionary = {
            active: 'فعال',
            inactive: 'غیرفعال',
            retired: 'بازنشسته'
        }

        return {
            personal_info: {
                avatar: userDTO.avatar,
                full_name: userDTO.first_name + ' ' + userDTO.last_name,
                national_code: userDTO.national_code,
                gender: userDTO.gender === 'male' ? 'مرد' : 'زن',
                birth_date: userDTO.birth_date.replace(/-/g, '/'),
                phone: userDTO.phone,
                email: userDTO.email,
                address: userDTO.address
            },
            work_info: {
                code: professorDTO.professor_code, // کد استاد
                department: department?.dataValues?.name, // نام گروه آموزشی
                academic_rank: academicRankDictionary[professorDTO.academic_rank], // رتبه علمی
                hire_date: professorDTO.hire_date.replace(/-/g, '/'), // تاریخ استخدام
                specialization: professorDTO.specialization, // تخصص
                office_phone: professorDTO.office_phone, // شماره تلفن محل کار
                office_address: professorDTO.office_address, // آدرس محل کار
                degree: degree?.dataValues?.name, // مقطع تحصیلی
                study: study?.dataValues?.name, // رشته تحصیلی
                work_experience_years: professorDTO.work_experience_years, // سابقه کاری
                status: statusDictionary[professorDTO.status], // وضعیت
                research_interests: JSON.parse(professorDTO?.research_interests || '[]') // سبک تحقیقاتی
            },
            files: {
                cv_file: professorDTO.cv_file, // فایل رزومه
                national_card_file: professorDTO.national_card_file, // فایل کارت ملی
                birth_certificate_file: professorDTO.birth_certificate_file, // فایل شناسنامه
                military_service_file: professorDTO.military_service_file, // فایل سربازی
                phd_certificate_file: professorDTO.phd_certificate_file // فایل دکترای
            }
        }
    },
    list: async (professorId: string) => {
        const classes = (await ClassScheduleModel.findAll({
            where: { professor_id: professorId },
            include: [
                {
                    model: ClassModel,
                    as: 'class',
                    include: [
                        {
                            model: CourseModel,
                            as: 'course',
                            attributes: ['id', 'name', 'code', 'theoretical_units', 'practical_units']
                        }
                    ]
                },
                {
                    model: SemesterModel,
                    as: 'semester',
                    attributes: ['id', 'academic_year', 'term_number', 'start_date', 'end_date', 'status']
                },
                {
                    model: ClassroomModel,
                    as: 'classroom',
                    attributes: ['name', 'building_name', 'floor_number', 'capacity']
                }
            ],
            order: [
                ['semester', 'academic_year', 'DESC'],
                ['semester', 'term_number', 'DESC']
            ]
        })) as IClassSchedule[]

        // Get students for each class schedule
        const classesWithStudents = await Promise.all(
            classes.map(async (classSchedule) => {
                const enrollments = await EnrollmentModel.findAll({
                    where: { class_schedule_id: classSchedule.id },
                    include: [
                        {
                            model: StudentModel,
                            as: 'student',
                            include: [
                                {
                                    model: UserModel,
                                    as: 'user',
                                    attributes: ['first_name', 'last_name', 'national_code']
                                }
                            ]
                        }
                    ]
                })

                return {
                    id: classSchedule.id,
                    course: {
                        name: classSchedule.class.course.name,
                        code: classSchedule.class.course.code,
                        units: {
                            theoretical: classSchedule.class.course.theoretical_units,
                            practical: classSchedule.class.course.practical_units,
                            total:
                                classSchedule.class.course.theoretical_units +
                                classSchedule.class.course.practical_units
                        }
                    },
                    semester: {
                        academic_year: classSchedule.semester.academic_year,
                        term_number: classSchedule.semester.term_number,
                        start_date: classSchedule.semester.start_date,
                        end_date: classSchedule.semester.end_date,
                        status: classSchedule.semester.status
                    },
                    classroom: {
                        name: classSchedule.classroom.name,
                        building: classSchedule.classroom.building_name,
                        floor: classSchedule.classroom.floor_number,
                        capacity: classSchedule.classroom.capacity,
                        enrolled_students: classSchedule.class.enrolled_students
                    },
                    status: classSchedule.class.status,
                    students: enrollments.map((enrollment) => ({
                        student_code: enrollment.dataValues.student.student_code,
                        first_name: enrollment.dataValues.student.user.first_name,
                        last_name: enrollment.dataValues.student.user.last_name,
                        national_code: enrollment.dataValues.student.user.national_code
                    }))
                }
            })
        )

        return classesWithStudents
    }
}

export default professorPanelService
