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
import { SemesterModel } from '../../models/semester.model'
import { ImportantDateModel } from '../../models/importantDate.model'
import highSchoolDiplomaServices from '../highSchoolDiploma/highSchoolDiploma.service'
import entryYearCourseService from '../entryYearCourse/entryYearCourse.service'
import { APP_ENV } from '../../core/config/dotenv.config'
import { EnrollmentStatusModel } from '../../models/enrollmentStatus.model'

const PROTOCOL = APP_ENV.application.protocol
const HOST = APP_ENV.application.host
const PORT = APP_ENV.application.port

const BASE_URL = `${PROTOCOL}://${HOST}:${PORT}`

const dayOfWeekDictionary: Record<string, string> = {
    '0': 'شنبه',
    '1': 'یکشنبه',
    '2': 'دوشنبه',
    '3': 'سه شنبه',
    '4': 'چهارشنبه',
    '5': 'پنج شنبه',
    '6': 'جمعه'
}

const studentPanelService = {
    async profile({ studentDTO, userDTO }: { studentDTO: TStudentType; userDTO: TUserType }) {
        const militaryStatusDictionary: Record<string, string> = {
            active: 'فعال',
            completed: 'تکمیل شده',
            exempted: 'اجازه‌ی صدور',
            postponed: 'معافیت'
        }

        const studentStatusDictionary: Record<string, string> = {
            active: 'فعال',
            deActive: 'غیرفعال',
            studying: 'در حال تحصیل',
            graduate: 'فارغ‌التحصیل'
        }

        const degree = await degreeServices.getDegreeNameById(studentDTO.degree_id)
        const study = await studyServices.getStudyNameById(studentDTO.study_id)
        const department = await departmentServices.getDepartmentNameById(studentDTO.department_id)

        const highSchoolDiploma = await highSchoolDiplomaServices.getHighSchoolDiplomaById(
            studentDTO.high_school_diploma_id
        )
        const preStudy = await studyServices.getStudyNameById(highSchoolDiploma?.dataValues?.pre_study_id)

        return {
            personal_information: {
                avatar: userDTO.avatar,
                name: userDTO.first_name + ' ' + userDTO.last_name,
                national_code: userDTO.national_code,
                birth_date: moment(userDTO.birth_date, 'YYYY-MM-DD').format('jYYYY/jMM/jDD'),
                gender: userDTO.gender === 'male' ? 'مرد' : 'زن',
                phone: userDTO.phone,
                email: userDTO.email,
                military_status: militaryStatusDictionary[studentDTO.military_status],
                address: userDTO.address
            },
            education_information: {
                student_code: studentDTO.student_code,
                entry_year: studentDTO.entry_year.toString(),
                degree: degree?.dataValues?.name,
                study: study?.dataValues?.name,
                department: department?.dataValues?.name,
                status: studentStatusDictionary[studentDTO.student_status]
            },
            diploma_information: {
                name: highSchoolDiploma?.dataValues?.school_name,
                diploma_date: moment(highSchoolDiploma?.dataValues?.diploma_date).format('jYYYY/jMM/jDD'),
                study: preStudy?.dataValues?.name,
                grade: highSchoolDiploma?.dataValues.grade
            }
        }
    },

    async allowedEnrollmentCourses(studentDTO: TStudentType) {
        // Get student's entry year courses
        const entryYearCourses = await entryYearCourseService.groupeByEntryYear(studentDTO.entry_year)
        const allEntryYearCourses = entryYearCourses?.[0]?.courses || []

        // Get student's current enrollments
        const enrollments = await EnrollmentModel.findAll({
            where: { student_id: studentDTO.id },
            include: [
                {
                    model: ClassScheduleModel,
                    include: [
                        {
                            model: ClassModel,
                            include: [{ model: CourseModel }]
                        },
                        {
                            model: SemesterModel,
                            attributes: ['id', 'academic_year', 'term_number', 'status']
                        }
                    ]
                }
            ]
        })

        // Get detailed information for each allowed course
        const coursesWithDetails = await Promise.all(
            allEntryYearCourses.map(async (course) => {
                // Get class schedules for this course
                const classSchedules = await ClassScheduleModel.findAll({
                    include: [
                        {
                            model: ClassModel,
                            where: { course_id: course.id },
                            include: [{ model: CourseModel }]
                        },
                        {
                            model: ProfessorModel,
                            include: [{ model: UserModel, attributes: ['first_name', 'last_name', 'avatar'] }]
                        },
                        {
                            model: ClassroomModel,
                            attributes: ['name', 'building_name', 'floor_number', 'capacity']
                        },
                        {
                            model: SemesterModel,
                            where: { status: 'active' },
                            attributes: ['id', 'academic_year', 'term_number']
                        }
                    ]
                })

                // Format class schedules
                const schedules = classSchedules.map((schedule: any) => {
                    const classroomCapacity = schedule.classroom.capacity
                    const enrolledStudents = schedule.class.enrolled_students
                    const availableSpots = classroomCapacity - enrolledStudents

                    return {
                        id: schedule.id,
                        class_id: schedule.class.id,
                        professor: {
                            name: `${schedule.professor.user.first_name} ${schedule.professor.user.last_name}`,
                            type: schedule.professor.type || 'عادی',
                            avatar: `${BASE_URL}${schedule.professor.user.avatar}`
                        },
                        classroom: {
                            name: schedule.classroom.name,
                            building: schedule.classroom.building_name,
                            floor:
                                schedule.classroom.floor_number === '0'
                                    ? 'همکف'
                                    : `طبقه ${schedule.classroom.floor_number}`,
                            capacity: classroomCapacity,
                            enrolled_students: enrolledStudents,
                            available_spots: availableSpots
                        },
                        day_of_week: dayOfWeekDictionary[schedule.day_of_week],
                        start_time: schedule.start_time.substring(0, 5),
                        end_time: schedule.end_time.substring(0, 5)
                    }
                })

                return {
                    course_name: course?.name,
                    course_code: course?.code,
                    course_unit: Number(course?.theoretical_units) + Number(course?.practical_units) || 0,
                    prerequisites: course?.prerequisites || [],
                    corequisites: course?.corequisites || [],
                    schedules: schedules || []
                }
            })
        )

        return coursesWithDetails
    },

    async enrollmentStatus(studentDTO: TStudentType) {
        const degree = await degreeServices.getDegreeNameById(studentDTO.degree_id)
        const study = await studyServices.getStudyNameById(studentDTO.study_id)
        const department = await departmentServices.getDepartmentNameById(studentDTO.department_id)

        const enrolmentStatusTime = await this.enrolmentStatusTime({
            entry_year: studentDTO.entry_year,
            department_id: studentDTO.department_id,
            degree_id: studentDTO.degree_id,
            study_id: studentDTO.study_id
        })

        const class_list = (await this.allowedEnrollmentCourses(studentDTO)).filter(
            (course: any) => course?.schedules?.length > 0
        )

        const semesterYear = enrolmentStatusTime?.start_date?.date.split('/')[0]
        const semesterMonth = Number(enrolmentStatusTime?.start_date?.date.split('/')[1])

        let semesterTitle = ''

        if (semesterMonth >= 11 || semesterMonth === 12 || semesterMonth === 1) {
            semesterTitle = 'ترم بهار'
        } else if (semesterMonth >= 2 && semesterMonth <= 3) {
            semesterTitle = 'ترم بهار'
        } else if (semesterMonth >= 4 && semesterMonth <= 6) {
            semesterTitle = 'ترم تابستان'
        } else if (semesterMonth >= 7 && semesterMonth <= 10) {
            semesterTitle = 'ترم پاییز'
        }

        return {
            title: `${semesterTitle} ${semesterYear} - دانشکده مهندسی`,
            student_information: {
                entry_year: studentDTO.entry_year?.toString(),
                degree: degree?.dataValues?.name,
                study: study?.dataValues?.name,
                department: department?.dataValues?.name
            },
            enrolment_status_time: enrolmentStatusTime,
            class_list
        }
    },

    async weeklySchedule(studentDTO: TStudentType) {
        const enrollments = await EnrollmentModel.findAll({
            where: { student_id: studentDTO.id },
            include: [
                {
                    model: EnrollmentStatusModel,
                    attributes: { exclude: ['id', 'enrollment_id', 'updated_at', 'created_at'] }
                },
                {
                    model: ClassScheduleModel,
                    include: [
                        { model: SemesterModel, where: { status: 'active' } },
                        { model: ClassroomModel },
                        { model: ClassModel, include: [{ model: CourseModel }] },
                        {
                            model: ProfessorModel,
                            attributes: ['id'],
                            include: [{ model: UserModel, attributes: ['first_name', 'last_name'] }]
                        }
                    ]
                }
            ]
        })

        const statusDictionary: Record<string, string | null> = {
            pending_department_head: null,
            pending_education_assistant: null,
            approved_by_department_head: 'تایید از مدیر گروه',
            approved_by_education_assistant: 'تایید از معاون آموزشی',
            rejected_by_department_head: 'رد از مدیر گروه',
            rejected_by_education_assistant: 'رد از معاون آموزشی'
        }

        const serializedEnrollments = enrollments.map((enrollment: any) => {
            const classSchedule = enrollment.dataValues.class_schedule

            return {
                id: enrollment.dataValues.id,
                status: {
                    title: statusDictionary[enrollment.dataValues.enrollment_status.status],
                    status: enrollment.dataValues.enrollment_status.status.includes('pending')
                        ? 'pending'
                        : enrollment.dataValues.enrollment_status.status.includes('rejected')
                        ? 'rejected'
                        : 'approved'
                },
                day: dayOfWeekDictionary[classSchedule.day_of_week],
                start_time: classSchedule.start_time.substring(0, 5),
                end_time: classSchedule.end_time.substring(0, 5),
                course_name: classSchedule.class.course.name,
                professor: classSchedule.professor.user.first_name + ' ' + classSchedule.professor.user.last_name,
                address: `ساختمان ${classSchedule.classroom.building_name} - طبقه ${classSchedule.classroom.floor_number} - کلاس شماره ${classSchedule.classroom.name}`
            }
        })

        return serializedEnrollments
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
    },

    async allSemestersWithDetails(studentDTO: TStudentType) {
        const enrollments = await EnrollmentModel.findAll({
            where: { student_id: studentDTO.id },
            include: [
                {
                    model: EnrollmentStatusModel
                },
                {
                    model: ClassScheduleModel,
                    include: [
                        {
                            model: SemesterModel,
                            attributes: ['id', 'academic_year', 'term_number', 'start_date', 'end_date', 'status']
                        },
                        {
                            model: ClassModel,
                            include: [{ model: CourseModel }]
                        }
                    ]
                }
            ]
        })

        const enrollmentStatusesDictionary: Record<string, { status_title: string; status: string; message?: string }> =
            {
                pending_department_head: {
                    status_title: 'انتظار تایید از مدیر گروه',
                    status: 'pending',
                    message: 'درخواست شما در انتظار بررسی توسط مدیر گروه می‌باشد'
                },
                pending_education_assistant: {
                    status_title: 'انتظار تایید از معاون آموزشی',
                    status: 'pending',
                    message: 'درخواست شما در انتظار بررسی توسط معاون آموزشی می‌باشد'
                },
                approved_by_department_head: {
                    status_title: 'تایید از مدیر گروه',
                    status: 'approved',
                    message: 'درخواست شما توسط مدیر گروه تایید شده است - در انتظار تایید معاون آموزشی'
                },
                // approved_by_education_assistant: {
                //     status_title: 'تایید از معاون آموزشی',
                //     status: 'approved',
                //     message: 'درخواست شما توسط معاون آموزشی تایید شده است - در انتظار تایید مدیر گروه'
                // },
                rejected_by_department_head: {
                    status_title: 'رد از مدیر گروه',
                    status: 'rejected',
                    message: 'جهت تکمیل درخواست خود با مدیر گروه تماس بگیرید'
                },
                rejected_by_education_assistant: {
                    status_title: 'رد از معاون آموزشی',
                    status: 'rejected',
                    message: 'جهت تکمیل درخواست خود با معاون آموزشی تماس بگیرید'
                }
            }

        const semesters: any = {}
        enrollments.forEach((enrollment: any) => {
            const schedule = enrollment.class_schedule
            const semester = schedule?.semester
            const course = schedule?.class?.course
            const enrollmentStatus = enrollment?.enrollment_status
            if (!semester) return

            if (!semesters[semester.id]) {
                semesters[semester.id] = {
                    id: semester.id,
                    academic_year: semester.academic_year,
                    year: semester.academic_year.split('-')[0],
                    term_number: semester.term_number,
                    start_date: semester.start_date.replaceAll('-', '/'),
                    end_date: semester.end_date.replaceAll('-', '/'),
                    status: semester.status,
                    courses: []
                }
            }
            if (course) {
                semesters[semester.id].courses.push({
                    id: course.id,
                    name: course.name,
                    code: course.code,
                    theoretical_units: course.theoretical_units,
                    practical_units: course.practical_units,
                    enrollment_status: enrollmentStatusesDictionary[enrollmentStatus?.status] || null
                })
            }
        })

        return Object.values(semesters)
    },

    async getCurrentSemesterDetails(studentDTO: TStudentType) {
        // First try to get active semester
        const activeSemester = await SemesterModel.findOne({
            where: { status: 'active' },
            attributes: ['id', 'academic_year', 'term_number', 'start_date', 'end_date', 'status']
        })

        // Check if student has enrollments in the active semester
        let hasActiveEnrollments = false
        let semester = activeSemester
        let isActiveSemester = true
        let enrollments: any[] = []

        if (activeSemester) {
            // Get enrollments for active semester
            enrollments = await EnrollmentModel.findAll({
                where: { student_id: studentDTO.id },
                include: [
                    {
                        model: ClassScheduleModel,
                        where: { semester_id: activeSemester.dataValues.id },
                        include: [
                            {
                                model: ClassModel,
                                include: [{ model: CourseModel }]
                            },
                            {
                                model: SemesterModel,
                                attributes: ['id', 'academic_year', 'term_number', 'start_date', 'end_date', 'status']
                            }
                        ]
                    }
                ]
            })

            hasActiveEnrollments = enrollments.length > 0
        }

        // If no active semester enrollments, find the last enrollment
        if (!hasActiveEnrollments) {
            isActiveSemester = false

            // Get all enrollments for this student, ordered by creation date
            const lastEnrollment: any = await EnrollmentModel.findOne({
                where: { student_id: studentDTO.id },
                include: [
                    {
                        model: ClassScheduleModel,
                        include: [
                            {
                                model: ClassModel,
                                include: [{ model: CourseModel }]
                            },
                            {
                                model: SemesterModel,
                                attributes: ['id', 'academic_year', 'term_number', 'start_date', 'end_date', 'status']
                            }
                        ]
                    }
                ],
                order: [['createdAt', 'DESC']]
            })

            if (lastEnrollment) {
                // Get the semester from the last enrollment
                const lastSemester = lastEnrollment.class_schedule?.semester
                if (lastSemester) {
                    semester = lastSemester

                    // Get all enrollments for this semester
                    enrollments = await EnrollmentModel.findAll({
                        where: { student_id: studentDTO.id },
                        include: [
                            {
                                model: ClassScheduleModel,
                                where: { semester_id: lastSemester.id },
                                include: [
                                    {
                                        model: ClassModel,
                                        include: [{ model: CourseModel }]
                                    }
                                ]
                            }
                        ]
                    })
                }
            }
        }

        // If no semester or enrollments found, return null
        if (!semester || enrollments.length === 0) {
            return null
        }

        // Count registered classes
        const registeredClassesCount = enrollments.length

        // Calculate total units
        let totalUnits = 0
        enrollments.forEach((enrollment: any) => {
            const course = enrollment.class_schedule?.class?.course
            if (course) {
                totalUnits += (course.theoretical_units || 0) + (course.practical_units || 0)
            }
        })

        // Determine registration status
        let registrationStatus = 'ثبت‌نام نشده'

        if (registeredClassesCount > 0) {
            // بررسی وضعیت تایید ثبت‌نام‌ها
            const pendingCount = enrollments.filter(
                (enrollment: any) => enrollment.dataValues.status === 'pending'
            ).length

            const approvedCount = enrollments.filter(
                (enrollment: any) => enrollment.dataValues.status === 'approved'
            ).length

            const rejectedCount = enrollments.filter(
                (enrollment: any) => enrollment.dataValues.status === 'rejected'
            ).length

            if (pendingCount > 0) {
                registrationStatus = 'در انتظار تأیید معاون آموزشی'
            } else if (approvedCount === enrollments.length) {
                registrationStatus = 'تأیید شده'
            } else if (rejectedCount > 0) {
                registrationStatus = 'رد شده'
            }
        }

        return {
            // semester: {
            //     id: semester.dataValues.id,
            //     academic_year: semester.dataValues.academic_year,
            //     term_number: semester.dataValues.term_number,
            //     start_date: semester.dataValues.start_date.replaceAll('-', '/'),
            //     end_date: semester.dataValues.end_date.replaceAll('-', '/'),
            //     status: semester.dataValues.status,
            //     is_current: isActiveSemester
            // },
            registration_status: registrationStatus,
            registered_classes_count: registeredClassesCount,
            total_units: totalUnits
        }
    },

    async importantDates({
        entry_year,
        department_id,
        degree_id,
        study_id
    }: {
        entry_year: number
        department_id: number
        degree_id: number
        study_id: number
    }) {
        const importantDates = await ImportantDateModel.findAll({
            where: { entry_year, department_id, degree_id, study_id },
            attributes: ['type', 'start_date', 'end_date']
        })

        const nowMoment = moment()

        const typeDictionary: Record<string, string> = {
            enrollment: 'انتخاب واحد',
            add_drop: 'حذف و اضافه'
        }

        return importantDates.map((date) => {
            const startMoment = moment(date.dataValues.start_date, 'jYYYY-jMM-jDDTHH:mm')
            const endMoment = moment(date.dataValues.end_date, 'jYYYY-jMM-jDDTHH:mm')

            let status = 'not_started'
            if (nowMoment.isSameOrAfter(startMoment) && nowMoment.isSameOrBefore(endMoment)) {
                status = 'in_progress'
            } else if (nowMoment.isAfter(endMoment)) {
                status = 'ended'
            }

            const startData = {
                date: date.dataValues.start_date.split('T')[0].replaceAll('-', '/'),
                time: date.dataValues.start_date.split('T')[1]
            }

            const endData = {
                date: date.dataValues.end_date.split('T')[0].replaceAll('-', '/'),
                time: date.dataValues.end_date.split('T')[1]
            }

            return {
                type: typeDictionary[date.dataValues.type] || date.dataValues.type,
                start_date: startData,
                end_date: endData,
                status: status
            }
        })
    },

    async enrolmentStatusTime(payload: {
        entry_year: number
        department_id: number
        degree_id: number
        study_id: number
    }) {
        const importantDates = await this.importantDates(payload)

        const enrollmentTimes = importantDates.filter((date) => date.type === 'انتخاب واحد')

        if (enrollmentTimes.length > 0) {
            // Find the active enrollment time
            const activeEnrollmentTime = enrollmentTimes.find((time) => time.status === 'in_progress')

            // If there's an active enrollment time, return it
            if (activeEnrollmentTime) {
                return {
                    start_date: activeEnrollmentTime.start_date,
                    end_date: activeEnrollmentTime.end_date,
                    status: activeEnrollmentTime.status
                }
            }

            // If no active enrollment time, return the most recent one
            const sortedTimes = enrollmentTimes.sort((a, b) => {
                const aDate = moment(a.start_date.date, 'jYYYY/jMM/jDD')
                const bDate = moment(b.start_date.date, 'jYYYY/jMM/jDD')
                return bDate.valueOf() - aDate.valueOf()
            })

            return {
                start_date: sortedTimes[0].start_date,
                end_date: sortedTimes[0].end_date,
                status: sortedTimes[0].status
            }
        }

        return null
    },

    async requiredCourses(studentDTO: TStudentType) {
        const degree = await degreeServices.getDegreeNameById(studentDTO.degree_id)
        const study = await studyServices.getStudyNameById(studentDTO.study_id)
        const department = await departmentServices.getDepartmentNameById(studentDTO.department_id)

        // Get student's entry year as string (e.g., 1402)
        const entryYear = String(studentDTO.entry_year)

        // Get all enrollments for the student
        const enrollments = await EnrollmentModel.findAll({
            where: { student_id: studentDTO.id },
            include: [
                {
                    model: ClassScheduleModel,
                    include: [
                        {
                            model: ClassModel,
                            include: [{ model: CourseModel }]
                        },
                        {
                            model: SemesterModel,
                            attributes: ['id', 'academic_year', 'term_number', 'status']
                        }
                    ]
                }
            ]
        })

        // Filter enrollments to only those in entry year
        const entryYearEnrollments = enrollments.filter((enrollment: any) => {
            const semester = enrollment.dataValues.class_schedule.semester
            return semester && semester.academic_year.startsWith(entryYear)
        })

        // const allCourses = await CourseModel.findAll()
        const entryYearCourses = await entryYearCourseService.groupeByEntryYear(studentDTO.entry_year)

        const allCourses = entryYearCourses?.[0]?.courses

        // Create a map of course statuses
        const courseStatuses = allCourses?.map((course) => {
            const courseEnrollments = entryYearEnrollments.filter(
                (enrollment) => enrollment.dataValues.class_schedule.class.course.id === course.id
            )

            const courseCorequisites = course.corequisites.map((e: any) => e.name) || []
            const coursePrerequisites = course.prerequisites.map((e: any) => e.name) || []

            if (courseEnrollments.length === 0) {
                return {
                    course_name: course.name,
                    course_code: course.code,
                    course_unit: course.theoretical_units + course.practical_units,
                    status: 'not_taken',
                    prerequisites: coursePrerequisites,
                    corequisites: courseCorequisites,
                    status_text: 'هنوز در انتخاب واحد آن درس را بر نداشته است',
                    semester: null
                }
            }

            // Get the latest enrollment for this course
            const latestEnrollment = courseEnrollments.reduce((latest, current) => {
                const latestSemester = latest.dataValues.class_schedule.semester
                const currentSemester = current.dataValues.class_schedule.semester

                if (latestSemester.academic_year > currentSemester.academic_year) return latest
                if (latestSemester.academic_year < currentSemester.academic_year) return current
                return latestSemester.term_number > currentSemester.term_number ? latest : current
            })

            const semester = latestEnrollment.dataValues.class_schedule.semester

            const isActiveSemester = semester.status === 'active'

            return {
                course_name: course.name,
                course_code: course.code,
                corequisites: courseCorequisites,
                prerequisites: coursePrerequisites,
                course_unit: Number(course.theoretical_units) + Number(course.practical_units) || 0,
                status: isActiveSemester ? 'progress' : 'taken',
                status_text: isActiveSemester ? 'در حال گذراندن درس' : 'درس را اخذ کرده است',
                semester: {
                    academic_year: semester.academic_year,
                    term_text: semester.term_number === '1' ? 'نیمسال اول' : 'نیمسال دوم'
                }
            }
        })

        // Sort courses by status using Map for better performance
        const statusPriority = new Map([
            ['progress', 0],
            ['taken', 1],
            ['not_taken', 2]
        ])

        const sortedCourseStatuses = courseStatuses?.sort(
            (a, b) => (statusPriority.get(a.status) || 0) - (statusPriority.get(b.status) || 0)
        )

        return {
            courses: sortedCourseStatuses || [],
            student_information: {
                entry_year: studentDTO.entry_year?.toString(),
                degree: degree?.dataValues?.name,
                study: study?.dataValues?.name,
                department: department?.dataValues?.name,
                total_units: courseStatuses?.reduce((acc, course) => acc + (course?.course_unit || 0), 0) || 0
            }
        }
    }
}

export default studentPanelService

