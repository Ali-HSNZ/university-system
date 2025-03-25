/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Student]
 *     summary: Register a new student
 *     description: |
 *       - **Before registering, ensure that degree and department exist in the system.**
 *       - This endpoint is used to register students with detailed academic and personal information.
 *
 *       ### **📝 Required Fields:**
 *       - **first_name** (string) - نام
 *       - **last_name** (string) - نام خانوادگی
 *       - **national_code** (string, unique) - کد ملی
 *       - **password** (string) - رمز عبور
 *       - **degree_id** (integer) - شناسه مقطع تحصیلی
 *       - **department_id** (integer) - شناسه دانشکده
 *       - **entry_year** (integer) - سال ورود
 *       - **entry_semester** (integer) - نیمسال ورود (1: پاییز، 2: بهار)
 *       - **student_code** (string, unique) - شماره دانشجویی
 *       - **role** (string) - نقش کاربر (فقط 'student')
 *
 *       ### **📌 Optional Fields:**
 *       - **birth_date** (string, format: YYYY-MM-DD) - تاریخ تولد
 *       - **phone_number** (string) - شماره موبایل
 *       - **email** (string) - ایمیل
 *       - **profile_image** (string) - آدرس تصویر پروفایل
 *
 *       ### **🏫 Academic Information:**
 *       - **student_status** (string) - وضعیت دانشجو (فعال، فارغ‌التحصیل، مرخصی، مشروط، اخراج، ...)
 *       - **total_passed_units** (integer) - 📌 **محاسبه‌شده از جداول `Enrollment` و `Grades`** → تعداد کل واحدهای گذرانده‌شده.
 *       - **current_term_units** (integer) - 📌 **محاسبه‌شده از جداول `Enrollment` و `Semester`** → تعداد واحدهای انتخابی در ترم جاری.
 *       - **total_terms_passed** (integer) - 📌 **محاسبه‌شده از جدول `Semester`** → تعداد ترم‌هایی که دانشجو حداقل یک واحد اخذ کرده است.
 *       - **probation_terms** (integer) - 📌 **محاسبه‌شده از جداول `Grades` و `Semester`** → تعداد ترم‌هایی که معدل کمتر از ۱۲ داشته است.
 *       - **term_gpa** (float) - 📌 **محاسبه‌شده از `Grades` و `Enrollment`** → معدل ترم جاری، میانگین نمرات تقسیم بر تعداد واحدها.
 *       - **total_gpa** (float) - 📌 **محاسبه‌شده از `Grades` و `Enrollment`** → معدل کل، میانگین نمرات کل گذرانده شده تقسیم بر مجموع واحدها.
 *
 *       ### **📂 Documents & Military Status:**
 *       - **high_school_diploma** (string) - تصویر مدرک دیپلم
 *       - **pre_university_certificate** (string) - تصویر مدرک پیش‌دانشگاهی
 *       - **military_status** (string) - وضعیت نظام وظیفه (فقط برای دانشجویان پسر)
 *       - **military_service_image** (string) - تصویر کارت پایان خدمت
 *
 *       ### **👨‍👩‍👧‍👦 Guardian Information:**
 *       - **guardian_name** (string) - نام ولی / سرپرست قانونی
 *       - **guardian_phone** (string) - شماره تماس ولی
 *
 *       ### **📍 Address Information:**
 *       - **address** (string) - آدرس محل سکونت
 *       - **city** (string) - شهر
 *       - **province** (string) - استان
 *       - **postal_code** (string) - کد پستی
 *       - **landline_phone** (string) - شماره تلفن ثابت
 *
 *       ### **📌 Registration Status & Course Selection:**
 *       - **registration_status** (string) - وضعیت انتخاب واحد (در حال ثبت‌نام، تأیید شده، تأیید نشده)
 *       - **max_allowed_units** (integer) - تعداد واحدهای مجاز در ترم جاری
 *       - **dropped_units** (integer) - تعداد واحدهای حذف‌شده
 *       - **remaining_units_to_graduate** (integer) - تعداد واحدهای باقی‌مانده تا فارغ‌التحصیلی
 *
 *       ### **🎓 Thesis & Research Information (For Master & PhD Students):**
 *       - **thesis_title** (string) - عنوان پایان‌نامه
 *       - **supervisor_name** (string) - نام استاد راهنما
 *       - **thesis_defense_status** (string) - وضعیت دفاع از پایان‌نامه
 *       - **thesis_score** (float) - نمره پایان‌نامه
 *
 *       ### **📌 Student Performance & Requests:**
 *       - **academic_warnings** (integer) - تعداد اخطارهای آموزشی
 *       - **failed_courses_count** (integer) - تعداد دروس افتاده
 *       - **course_retake_count** (integer) - تعداد دروسی که مجدد اخذ شده‌اند
 *       - **absence_count** (integer) - تعداد غیبت‌های غیرمجاز
 *       - **leave_requests** (array) - درخواست‌های مرخصی تحصیلی
 *       - **transfer_requests** (array) - درخواست‌های انتقالی
 *       - **urgent_course_drop_requests** (array) - درخواست‌های حذف اضطراری
 *
 *     responses:
 *       201:
 *         description: Student successfully registered
 *       400:
 *         description: Bad request, validation error
 *       409:
 *         description: Conflict, student with this national code or student_code already exists
 */
