type TEnrollmentRequestBodyType = {
    student_id: number
    class_schedule_ids: number[]
}

type TEnrollmentUpdateRequestBodyType = {
    status: 'pending' | 'approved' | 'rejected'
}

type THandleImportantTimeStatusType = {
    entry_year: number
    department_id: number
    degree_id: number
    study_id: number
}

export type { TEnrollmentRequestBodyType, TEnrollmentUpdateRequestBodyType, THandleImportantTimeStatusType }
