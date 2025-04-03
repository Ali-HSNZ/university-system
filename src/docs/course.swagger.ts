/**
 * @swagger
 * /course/list:
 *   get:
 *     tags: [Course]
 *     responses:
 *       200:
 *         description: A list of courses
 */

/**
 * @swagger
 * /course/{id}/info:
 *   get:
 *     tags: [Course]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A course info
 *       400:
 *         description: Bad Request
 */

/**
 * @swagger
 * /course/create:
 *   post:
 *     tags: [Course]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - theoretical_units
 *               - practical_units
 *               - department_id
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *                 description: نام درس
 *               type:
 *                 type: string
 *                 enum: ["theory", "practical", "combined"]
 *                 description: |
 *                   نوع درس:
 *                   - `theory`: نظری
 *                   - `practical`: عملی
 *                   - `combined`: ترکیبی
 *               theoretical_units:
 *                 description: تعداد واحد نظری
 *               practical_units:
 *                 type: integer
 *                 description: تعداد واحد عملی
 *               department_id:
 *                 type: integer
 *                 description: شناسه‌ی دپارتمان
 *               prerequisites:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: لیستی از کد دروس پیش‌نیاز
 *               corequisites:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: لیستی از کد دروس همنیاز
 *     responses:
 *       "201":
 *         description: درس با موفقیت ایجاد شد.
 *       "400":
 *         description: اطلاعات ارسالی معتبر نیست.
 *       "500":
 *         description: خطای داخلی سرور.
 */


/**
 * @swagger
 * /course/{id}/update:
 *   put:
 *     tags: [Course]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - theoretical_units
 *               - practical_units
 *               - department_id
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *                 description: نام درس
 *               type:
 *                 type: string
 *                 enum: ["theory", "practical", "combined"]
 *                 description: |
 *                   نوع درس:
 *                   - `theory`: نظری
 *                   - `practical`: عملی
 *                   - `combined`: ترکیبی
 *               theoretical_units:
 *                 description: تعداد واحد نظری
 *                 type: integer
 *                 example: 1
 *               practical_units:
 *                 type: integer
 *                 description: تعداد واحد عملی
 *                 example: 1
 *               department_id:
 *                 type: integer
 *                 description: شناسه‌ی دپارتمان
 *               prerequisites:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "123456"
 *                 description: لیستی از کد دروس پیش‌نیاز
 *               corequisites:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "123456"
 *                 description: لیستی از کد دروس همنیاز
 *     responses:
 *       "201":
 *         description: درس با موفقیت ایجاد شد.
 *       "400":
 *         description: اطلاعات ارسالی معتبر نیست.
 *       "500":
 *         description: خطای داخلی سرور.
 */
/**
 * @swagger
 * /course/{id}/delete:
 *   delete:
 *     tags: [Course]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A course deleted successfully
 *       400:
 *         description: Bad Request
 */
