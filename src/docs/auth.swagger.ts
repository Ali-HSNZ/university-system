/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: |
 *       - **Before registering, create degree and department in the system**
 *       - Base required fields:
 *         - **first_name** (optional) - نام
 *         - **last_name** (optional) - نام خانوادگی
 *         - **degree_id** - شناسه مقطع تحصیلی
 *         - **national_code** (for authentication - unique) - کد ملی
 *         - **password** (for authentication) - رمز عبور
 *         - **role** - نقش کاربر
 *              - student : دانشجو
 *              - professor : استاد
 *              - education_assistant : کارشناس آموزشی | معاون آموزشی
 *              - university_president : رییس دانشگاه
 *         - **gender** - جنسیت
 *              - male : مرد
 *              - female : زن
 *         - **national_code_image** - عکس کارت ملی
 *              -   file type (image/png, image/jpeg, image/jpg)
 *         - **military_image** - عکس نظام وظیفه
 *              -   file type (image/png, image/jpeg, image/jpg)
 *         - **military_status** - وضعیت نظام وظیفه
 *              - active : فعال
 *              - completed : تکمیل شده
 *              - exempted : استفاده از حق نظام وظیفه
 *              - postponed : تعویق
 *         - **phone** (optional - unique) - شماره تلفن
 *         - **email** (optional - unique) - ایمیل
 *         - **avatar** (optional) - عکس کاربر
 *              -   file type (image/png, image/jpeg, image/jpg)
 *       - If user role is **student** required fields are:
 *         - **degree_id** - شناسه مقطع تحصیلی
 *         - **department_id** - شناسه گروه آموزشی
 *         - **entry_date** - تاریخ ورود
 *         - **training_course_code** - کد دوره آموزشی
 *              - 11 : روزانه
 *              - 22 : شبانه
 *         - **entry_semester** - نیمسال ورود
 *              - 1 : اول
 *              - 2 : دوم
 *         - **student_status** - وضعیت دانشجویی
 *              - active : فعال
 *              - deActive : غیرفعال
 *              - studying : در حال تحصیل
 *              - graduate : فارغ التحصیل
 *       - If user role is **professor** required fields are:
 *         - **department_id** - شناسه گروه آموزشی
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - national_code
 *               - password
 *               - role
 *               - gender
 *               - national_code_image
 *               - degree_id
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               national_code:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: enum
 *                 enum:
 *                   - student
 *                   - professor
 *                   - education_assistant
 *                   - university_president
 *               gender:
 *                 type: enum
 *                 enum:
 *                   - male
 *                   - female
 *               national_code_image:
 *                 type: file
 *                 format: binary
 *               military_image:
 *                 type: file
 *                 format: binary
 *               military_status:
 *                 type: enum
 *                 enum:
 *                   - active
 *                   - completed
 *                   - exempted
 *                   - postponed
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               avatar:
 *                 type: file
 *                 format: binary
 *               degree_id:
 *                 type: string
 *               entry_date:
 *                 type: string
 *                 example: "2025-03-22"
 *               entry_semester:
 *                 type: enum
 *                 enum:
 *                   - 1
 *                   - 2
 *               training_course_code:
 *                 type: enum
 *                 enum:
 *                   - 11
 *                   - 22
 *               department_id:
 *                 type: string
 *
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Bad Request
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
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns token
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
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
