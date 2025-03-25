/**
 * @swagger
 * /auth/register/professor:
 *   post:
 *     tags: [Professor]
 *     summary: Register a new professor
 *     description: |
 *       - **Before registering, ensure the department exists in the system**
 *       - Base required fields:
 *         - **first_name** (string) - نام
 *         - **last_name** (string) - نام خانوادگی
 *         - **national_code** (string, unique) - کد ملی (برای احراز هویت)
 *         - **password** (string) - رمز عبور (برای احراز هویت)
 *         - **department_id** (integer) - شناسه گروه آموزشی
 *         - **email** (string) - ایمیل دانشگاهی
 *         - **phone** (string) - شماره تماس
 *         - **profile_image** (string) - آدرس تصویر پروفایل
 *
 *       ### **📚 Academic Information:**
 *       - **academic_rank** (string) - مرتبه علمی (استادیار، دانشیار، استاد)
 *       - **employment_type** (string) - نوع استخدام (رسمی، پیمانی، قراردادی، حق‌التدریس)
 *       - **employee_code** (string) - کد پرسنلی دانشگاه
 *       - **office_location** (string) - محل دفتر استاد
 *       - **office_phone** (string) - تلفن دفتر
 *
 *       ### **📖 Teaching Information:**
 *       - **courses_taught** (array) - لیست دروس تدریس‌شده (خوانده‌شده از جدول `Class`)
 *       - **current_courses** (array) - لیست دروس در حال تدریس در ترم جاری (خوانده‌شده از جدول `Class`)
 *
 *       ### **📌 Research & Publications:**
 *       - **publications** (array) - لیست مقالات منتشرشده
 *       - **research_projects** (array) - پروژه‌های تحقیقاتی در حال اجرا
 *
 *     responses:
 *       201:
 *         description: Professor successfully registered
 *       400:
 *         description: Bad request, validation error
 *       409:
 *         description: Conflict, professor with this national code or employee_code already exists
 */
