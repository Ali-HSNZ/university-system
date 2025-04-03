/**
 * @swagger
 *   /auth/register/student:
 *     post:
 *       tags: [Authentication]
 *       requestBody:
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               required:
 *                 - first_name
 *                 - last_name
 *                 - national_code
 *                 - gender
 *                 - birth_date
 *                 - department_id
 *                 - entry_year
 *                 - entry_semester
 *                 - school_name
 *                 - diploma_date
 *                 - pre_degree_id
 *                 - national_card_image
 *                 - birth_certificate_image
 *                 - military_service_image
 *                 - avatar
 *                 - address
 *                 - guardian_name
 *                 - guardian_phone
 *               properties:
 *                 first_name:
 *                   type: string
 *                   description: "نام"
 *                   example: "Ali"
 *                 last_name:
 *                   type: string
 *                   description: "نام خانوادگی"
 *                   example: "Rezaei"
 *                 national_code:
 *                   type: string
 *                   description: "کد ملی"
 *                   example: "1234567890"
 *                 gender:
 *                   type: string
 *                   description: "جنسیت"
 *                   enum: ["male", "female"]
 *                   example: "male"
 *                 birth_date:
 *                   type: string
 *                   format: date
 *                   description: "تاریخ تولد"
 *                   example: "2000-01-01"
 *                 phone:
 *                   type: string
 *                   description: "شماره تلفن"
 *                   example: "09123456789"
 *                 email:
 *                   type: string
 *                   description: "ایمیل"
 *                   example: "ali.rezaei@example.com"
 *                 address:
 *                   type: string
 *                   description: "آدرس"
 *                   example: "Tehran, Iran"
 *                 department_id:
 *                   type: integer
 *                   description: "شناسه گروه آموزشی"
 *                   example: 1
 *                 entry_year:
 *                   type: integer
 *                   description: "سال ورود"
 *                   example: 2025
 *                 entry_semester:
 *                   type: string
 *                   enum: ["1", "2"]
 *                   description: "نیمسال ورود **1: اول** **2: دوم**"
 *                   example: "1"
 *                 guardian_name:
 *                   type: string
 *                   description: "نام والد"
 *                   example: "Ali Rezaei parent"
 *                 guardian_phone:
 *                   type: string
 *                   description: "شماره تلفن والد"
 *                   example: "09123456789"
 *                 school_name:
 *                   type: string
 *                   description: "نام مدرسه/دانشگاه"
 *                   example: "Tehran High School"
 *                 diploma_date:
 *                   type: string
 *                   format: date
 *                   description: "تاریخ آخرین اخذ مدرک"
 *                   example: "2025-03-22"
 *                 pre_degree_id:
 *                   type: integer
 *                   description: "شناسه آخرین مدرک دانشگاهی"
 *                   example: 1
 *                 avatar:
 *                   type: string
 *                   format: binary
 *                   description: "عکس پرسنلی دانشجو"
 *                 national_card_image:
 *                   type: string
 *                   format: binary
 *                   description: "عکس کارت ملی"
 *                 birth_certificate_image:
 *                   type: string
 *                   format: binary
 *                   description: "عکس شناسنامه"
 *                 military_service_image:
 *                   type: string
 *                   format: binary
 *                   description: "عکس نظام وظیفه"
 *       responses:
 *         '200':
 *           description: "Student successfully registered"
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Student successfully registered"
 *                   student_id:
 *                     type: integer
 *                     example: 101
 *         '400':
 *           description: "Invalid input"
 *         '500':
 *           description: "Internal server error"
 */


/**
 * @swagger
 * /auth/register/professor:
 *   post:
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - national_code
 *               - birth_date
 *               - gender
 *               - avatar
 *               - national_card_file
 *               - birth_certificate_file
 *               - military_service_file
 *               - email
 *               - phone
 *               - employment_contract_file
 *               - department_id
 *               - degree_id
 *               - academic_rank
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: "نام"
 *                 example: "Ali"
 *               last_name:
 *                 type: string
 *                 description: "نام خانوادگی"
 *                 example: "Rezaei"
 *               email:
 *                 type: string
 *                 description: "ایمیل"
 *                 example: "ali.rezaei@example.com"
 *               phone:
 *                 type: string
 *                 description: "شماره تماس"
 *                 example: "09123456789"
 *               birth_date:
 *                 type: string
 *                 format: date
 *                 description: "تاریخ تولد"
 *                 example: "2000-01-01"
 *               gender:
 *                 type: enum
 *                 enum: ["male", "female"]
 *                 description: "جنسیت"
 *                 example: "male"
 *               national_code:
 *                 type: string
 *                 description: "کد ملی"
 *                 example: "1234567890"
 *               department_id:
 *                 type: integer
 *                 description: "شناسه گروه آموزشی"
 *                 example: 1
 *               degree_id:
 *                 type: integer
 *                 description: "شناسه مقطع تحصیلی"
 *                 example: 1
 *               academic_rank:
 *                 type: string
 *                 enum: ["instructor", "assistant_professor", "associate_professor", "professor"]
 *                 description: "رتبه علمی"
 *                 example: "instructor"
 *               hire_date:
 *                 type: string
 *                 format: date
 *                 description: "تاریخ استخدام"
 *                 example: "2025-03-22"
 *               specialization:
 *                 type: string
 *                 description: "تخصص علمی"
 *                 example: "Computer Science"
 *               office_phone:
 *                 type: string
 *                 description: "تلفن دفتر"
 *                 example: "09123456789"
 *               office_address:
 *                 type: string
 *                 description: "آدرس دفتر"
 *                 example: "Tehran, Iran"
 *               research_interests:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: "حوزه‌های تحقیقاتی"
 *                 example: ["Computer Vision"]
 *               work_experience_years:
 *                 type: integer
 *                 description: "سابقه کاری"
 *                 example: 5
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: "عکس پرسنلی استاد"
 *               cv_file:
 *                 type: string
 *                 description: "رزومه"
 *                 format: binary
 *               national_card_file:
 *                 type: string
 *                 description: "تصویر کارت ملی"
 *                 format: binary
 *               birth_certificate_file:
 *                 type: string
 *                 description: "تصویر شناسنامه"
 *                 format: binary
 *               military_service_file:
 *                 type: string
 *                 description: "تصویر کارت پایان خدمت"
 *                 format: binary
 *               phd_certificate_file:
 *                 type: string
 *                 description: "مدرک دکتری"
 *                 format: binary
 *               employment_contract_file:
 *                 type: string
 *                 format: binary
 *                 description: "قرارداد کاری"

 *     responses:
 *       "201":
 *         description: استاد با موفقیت ثبت شد
 *       "400":
 *         description: درخواست نامعتبر (خطا در داده‌های ورودی)
 *       "500":
 *         description: خطای داخلی سرور
 */



/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - national_code
 *               - password
 *             properties:
 *               national_code:
 *                 type: string
 *                 default: ''
 *               password:
 *                 type: string
 *                 default: ''
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized, invalid credentials
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       401:
 *         description: Unauthorized
 */
