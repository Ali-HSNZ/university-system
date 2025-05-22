type TStudentType = {
    id: number
    student_code: string
    pre_study_id: number
    pre_grade: number
    degree_id: number
    study_id: number
    department_id: number
    entry_year: number
    entry_semester: string
    student_status: 'active' | 'deActive' | 'studying' | 'graduate'
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
}


export default TStudentType
