import { InferType } from 'yup'
import { updateEnrollmentValidation } from '../enrollment/enrollment.validation'

type EnrollmentType = {
    id: number
    student_id: number
    class_schedule_id: number
    status_id: number
    createdAt: string
    updatedAt: string
    student: {
        id: number
        student_code: string
        pre_degree_id: number
        degree_id: number
        study_id: number
        department_id: number
        entry_year: number
        entry_semester: string
        student_status: string
        total_passed_units: number
        current_term_units: number
        probation_terms: number
        term_gpa: number | null
        total_gpa: number | null
        military_status: string
        guardian_name: string
        guardian_phone: string
        high_school_diploma_id: number
        national_card_image: string
        birth_certificate_image: string
        military_service_image: string
        createdAt: string
        updatedAt: string
        user_id: number
        user: {
            first_name: string
            last_name: string
            national_code: string
        }
        study: {
            id: number
            name: string
            description: string
            createdAt: string
            updatedAt: string
        }
        department: {
            id: number
            name: string
        }
    }
    class_schedule: {
        id: number
        class_id: number
        professor_id: number
        day_of_week: string
        start_time: string
        end_time: string
        session_count: number
        classroom_id: number
        semester_id: number
        class: {
            id: number
            enrolled_students: number
            status: string
            course_id: number
            course: {
                name: string
                code: string
            }
        }
        professor: {
            professor_code: string
            user: {
                first_name: string
                last_name: string
                national_code: string
            }
        }
        semester: {
            id: number
            academic_year: string
            term_number: string
            start_date: string
            end_date: string
            status: string
            deleted_at: string | null
            is_deleted: boolean
        }
        classroom: {
            id: number
            name: string
            building_name: string
            floor_number: string
            capacity: number
            description: string | null
        }
    }
    enrollment_status: {
        status: string
        department_head_id: number | null
        education_assistant_id: number | null
        department_head_comment: string | null
        education_assistant_comment: string | null
        department_head_decision_date: string | null
        education_assistant_decision_date: string | null
    }
}

export type TUpdateEnrollmentStatusInferType = InferType<typeof updateEnrollmentValidation>

export type { EnrollmentType }