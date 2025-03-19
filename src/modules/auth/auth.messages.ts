const authMessages = {
    register: {
        validation: {
            username: {
                min: 'نام کاربری نمیتواند کمتر از ۳ حرف باشد',
                max: 'نام کاربری نمیتواند بیشتر از ۵۰ حرف باشد'
            },
            password: {
                min: 'رمز عبور نمیتواند کمتر از ۶ کاراکتر باشد',
                required: 'رمز عبور الزامی است'
            },
            national_id: 'کد ملی باید ۱۰ رقم باشد',
            role: 'نقش الزامی است',
            full_name: 'نام و نام خانوادگی نمیتواند بیشتر از ۱۰۰ حرف باشد',
            email: 'ایمیل معتبر نیست',
            entry_year: 'سال ورود الزامی است',
            degree_id: 'مقطع تحصیلی الزامی است',
            department_id: 'گروه آموزشی الزامی است'
        }
    }
}

export default authMessages
