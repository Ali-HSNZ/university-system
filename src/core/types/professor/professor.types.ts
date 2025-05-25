type TProfessorType = {
    professor_code: string
    department_id: number
    academic_rank: 'instructor' | 'assistant_professor' | 'associate_professor' | 'professor'
    hire_date: string
    specialization: string
    office_phone: string
    office_address: string
    degree_id: number
    study_id: number
    cv_file: string
    national_card_file: string
    birth_certificate_file: string
    military_service_file: string
    phd_certificate_file: string
    work_experience_years: number
    status: 'active' | 'inactive' | 'retired'
    research_interests: string
    employment_contract_file: string
}

export default TProfessorType
