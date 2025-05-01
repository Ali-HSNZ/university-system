type TUserType = {
    id: number
    first_name: string
    last_name: string
    national_code: string
    gender: string
    birth_date: string
    phone: string
    email: string
    address: string
    role: string
    password: string
    avatar: string
    is_deleted: boolean
    deleted_by: number | null
    deleted_at: string | null
}

export default TUserType
