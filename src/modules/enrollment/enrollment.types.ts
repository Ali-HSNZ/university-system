type TEnrollmentRequestBodyType = {
    student_id: number
    class_schedule_ids: number[]
}

type TEnrollmentUpdateRequestBodyType = {
    status:
        | 'pending_department_head'
        | 'pending_education_assistant'
        | 'approved_by_department_head'
        | 'approved_by_education_assistant'
        | 'rejected_by_department_head'
        | 'rejected_by_education_assistant'
    comment: string
    user_role: 'department_head' | 'education_assistant'
}

type THandleImportantTimeStatusType = {
    entry_year: number
    department_id: number
    degree_id: number
    study_id: number
}

export type { TEnrollmentRequestBodyType, TEnrollmentUpdateRequestBodyType, THandleImportantTimeStatusType }
