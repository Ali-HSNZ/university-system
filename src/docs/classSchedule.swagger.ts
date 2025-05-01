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
 * /class-schedule/group-by-class:
 *   get:
 *     tags: [Class Schedule]
 *     responses:
 *       200:
 *         description: ساعات کلاس
 *       400:
 *         description: خطایی رخ داده است
 *       500:
 *         description: خطایی رخ داده است
 */


/**
 * @swagger
 * /class-schedule/create:
 *   post:
 *     tags: [Class Schedule]
 *     description: |
 *      - در این مسیر ساعت های کلاس و چه استادی آن کلاس را تدریس میکند توسط رئیس دانشگاه مشخص میشود
 *      - این به صورت خودکار ترم فعال را پیدا میکند و ساعات را برای آن ترم مشخص ایجاد میکند
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - class_id
 *               - classroom_id
 *               - professor_id
 *               - day_of_week
 *               - start_time
 *               - end_time
 *             properties:
 *               class_id:
 *                 type: integer
 *                 description: شناسه کلاس
 *                 example: 1
 *               classroom_id:
 *                 type: integer
 *                 description: شناسه سالن
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
 *     responses:
 *       201:
 *         description: ساعات کلاس ایجاد شد
 *       400:
 *         description: اطلاعات وارد شده معتبر نمی‌باشد
 */

// delete

/**
 * @swagger
 * /class-schedule/{id}/delete:
 *   delete:
 *     tags: [Class Schedule]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: ساعات کلاس حذف شد
 *       400:
 *         description: ساعات کلاس یافت نشد
 *       500:
 *         description: خطایی رخ داده است
 */

