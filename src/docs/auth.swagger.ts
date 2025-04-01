/**
 * @swagger
 *   /auth/register/student:
 *     post:
 *       summary: "Register a new student"
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
 * /auth/login:
 *   post:
 *     summary: User login
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
 *     summary: Logout the current user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       401:
 *         description: Unauthorized
 */
