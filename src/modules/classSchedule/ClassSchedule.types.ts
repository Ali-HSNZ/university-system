import { InferType } from 'yup'
import classScheduleSchema from './ClassSchedule.validation'

type TClassScheduleInferType = InferType<typeof classScheduleSchema>

type TClassScheduleListType = {
    id: number
    day_of_week: '0' | '1' | '2' | '3' | '4' | '5' | '6'
    start_time: string
    end_time: string
    session_count: number
    class: {
        id: number
        capacity: number
        enrolled_students: number
        status: 'open' | 'closed' | 'canceled'
        course_id: number
        course: {
            name: string
        }
    }
    semester: {
        academic_year: string
        term_number: '1' | '2'
        start_date: string
        end_date: string
        status: 'active' | 'inactive'
    }
    classroom: {
        name: string
        building_name: string
        floor_number: number
        capacity: number
    }
    professor: {
        id: number
        user: {
            id: number
            first_name: string
            last_name: string
        }
    }
}

export { TClassScheduleInferType, TClassScheduleListType }
