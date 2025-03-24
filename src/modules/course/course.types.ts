type TCreateCourseType = {
    name: string
    code: string
    theory_unit: number
    practical_unit: number
}

type TUpdateCourseType = Omit<TCreateCourseType, 'code'>

export { TCreateCourseType, TUpdateCourseType }
