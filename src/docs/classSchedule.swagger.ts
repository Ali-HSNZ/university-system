/**
 * @swagger
 * /class-schedule/list:
 *   get:
 *     tags: [Class Schedule]
 *     responses:
 *       200:
 *         description: ساعات کلاس
 */

/**
 * @swagger
 * /class-schedule/create:
 *   post:
 *     tags: [Class Schedule]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - class_id
 *               - professor_id
 *               - day_of_week
 *               - start_time
 *               - end_time
 *               - session_count
 *             properties:
 *               class_id:
 *                 type: integer
 *                 description: شناسه کلاس
 *                 example: 1
 *               professor_id:
 *                 type: integer
 *                 description: شناسه استاد
 *                 example: 1
 *               day_of_week:
 *                 type: enum
 *                 enum:
 *                   - 0
 *                   - 1
 *                   - 2
 *                   - 3
 *                   - 4
 *                   - 5
 *                   - 6
 *                 description: |
 *                   - **0** شنبه
 *                   - **1** یکشنبه
 *                   - **2** دوشنبه
 *                   - **3** سه شنبه
 *                   - **4** چهارشنبه
 *                   - **5** پنج شنبه
 *                   - **6** جمعه
 *
 *                 example: "Saturday"
 *               start_time:
 *                 type: string
 *                 description: ساعت شروع
 *                 example: "10:00"
 *               end_time:
 *                 type: string
 *                 description: ساعت پایان
 *                 example: "11:00"
 *               session_count:
 *                 type: integer
 *                 description: تعداد جلسات
 *                 example: 18
 *     responses:
 *       201:
 *         description: ساعات کلاس ایجاد شد
 *       400:
 *         description: اطلاعات وارد شده معتبر نمی‌باشد
 */
