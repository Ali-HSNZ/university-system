/**
 * @swagger
 * /student/list:
 *   get:
 *     tags: [Student]
 *     summary: "لیست تمام دانشجویان"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: "عملیات با موفقیت انجام شد"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "عملیات با موفقیت انجام شد"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       '401':
 *         description: "Unauthorized"
 *       '500':
 *         description: "Internal server error"
 */

/**
 * @swagger
 * /student/{id}/info:
 *   get:
 *     tags: [Student]
 *     summary: "دریافت اطلاعات دانشجو بر اساس شناسه"
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "شناسه دانشجو"
 *     responses:
 *       '200':
 *         description: "عملیات با موفقیت انجام شد"
 *       '400':
 *         description: "شناسه نامعتبر"
 *       '404':
 *         description: "دانشجویی با این اطلاعات یافت نشد"
 *       '500':
 *         description: "Internal server error"
 */

/**
 * @swagger
 * /student/info:
 *   get:
 *     tags: [Student]
 *     summary: "دریافت اطلاعات دانشجو بر اساس کاربر جاری"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: "عملیات با موفقیت انجام شد"
 *       '404':
 *         description: "دانشجویی با این مشخصات یافت نشد"
 *       '500':
 *         description: "Internal server error"
 */

/**
 * @swagger
 * /student/available-classes:
 *   get:
 *     tags: [Student]
 *     summary: "دریافت کلاس‌های قابل ثبت‌نام"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: "عملیات با موفقیت انجام شد"
 *       '404':
 *         description: "دانشجویی با این اطلاعات یافت نشد"
 *       '500':
 *         description: "Internal server error"
 */

/**
 * @swagger
 * /student/update:
 *   put:
 *     tags: [Student]
 *     summary: "بروزرسانی پروفایل دانشجو (برای دانشجوی جاری)"
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: "نام"
 *                 example: "Ali"
 *               last_name:
 *                 type: string
 *                 description: "نام خانوادگی"
 *                 example: "Rezaei"
 *               phone:
 *                 type: string
 *                 description: "شماره تلفن"
 *                 example: "09123456789"
 *               email:
 *                 type: string
 *                 description: "ایمیل"
 *                 example: "ali.rezaei@example.com"
 *               address:
 *                 type: string
 *                 description: "آدرس"
 *                 example: "Tehran, Iran"
 *               guardian_name:
 *                 type: string
 *                 description: "نام والد"
 *                 example: "Ali Rezaei parent"
 *               guardian_phone:
 *                 type: string
 *                 description: "شماره تلفن والد"
 *                 example: "09123456789"
 *               student_status:
 *                 type: string
 *                 enum: ["active", "deActive", "studying", "graduate"]
 *                 description: "وضعیت دانشجویی"
 *                 example: "active"
 *               military_status:
 *                 type: string
 *                 enum: ["active", "completed", "exempted", "postponed"]
 *                 description: "وضعیت نظام وظیفه"
 *                 example: "active"
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: "عکس پروفایل"
 *               national_card_image:
 *                 type: string
 *                 format: binary
 *                 description: "عکس کارت ملی"
 *               birth_certificate_image:
 *                 type: string
 *                 format: binary
 *                 description: "عکس شناسنامه"
 *               military_service_image:
 *                 type: string
 *                 format: binary
 *                 description: "عکس نظام وظیفه"
 *     responses:
 *       '200':
 *         description: "اطلاعات با موفقیت بروزرسانی شد"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "اطلاعات با موفقیت بروزرسانی شد"
 *                 data:
 *                   type: object
 *       '400':
 *         description: "داده‌های ورودی نامعتبر"
 *       '404':
 *         description: "دانشجویی با این مشخصات یافت نشد"
 *       '500':
 *         description: "Internal server error"
 */

/**
 * @swagger
 * /student/{id}/update:
 *   put:
 *     tags: [Student]
 *     summary: "بروزرسانی اطلاعات دانشجو بر اساس شناسه (برای ادمین)"
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "شناسه دانشجو"
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: "نام"
 *                 example: "Ali"
 *               last_name:
 *                 type: string
 *                 description: "نام خانوادگی"
 *                 example: "Rezaei"
 *               phone:
 *                 type: string
 *                 description: "شماره تلفن"
 *                 example: "09123456789"
 *               email:
 *                 type: string
 *                 description: "ایمیل"
 *                 example: "ali.rezaei@example.com"
 *               address:
 *                 type: string
 *                 description: "آدرس"
 *                 example: "Tehran, Iran"
 *               guardian_name:
 *                 type: string
 *                 description: "نام والد"
 *                 example: "Ali Rezaei parent"
 *               guardian_phone:
 *                 type: string
 *                 description: "شماره تلفن والد"
 *                 example: "09123456789"
 *               student_status:
 *                 type: string
 *                 enum: ["active", "deActive", "studying", "graduate"]
 *                 description: "وضعیت دانشجویی"
 *                 example: "active"
 *               military_status:
 *                 type: string
 *                 enum: ["active", "completed", "exempted", "postponed"]
 *                 description: "وضعیت نظام وظیفه"
 *                 example: "active"
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: "عکس پروفایل"
 *               national_card_image:
 *                 type: string
 *                 format: binary
 *                 description: "عکس کارت ملی"
 *               birth_certificate_image:
 *                 type: string
 *                 format: binary
 *                 description: "عکس شناسنامه"
 *               military_service_image:
 *                 type: string
 *                 format: binary
 *                 description: "عکس نظام وظیفه"
 *     responses:
 *       '200':
 *         description: "اطلاعات با موفقیت بروزرسانی شد"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "اطلاعات با موفقیت بروزرسانی شد"
 *                 data:
 *                   type: object
 *       '400':
 *         description: "داده‌های ورودی نامعتبر"
 *       '404':
 *         description: "دانشجویی با این اطلاعات یافت نشد"
 *       '500':
 *         description: "Internal server error"
 */
