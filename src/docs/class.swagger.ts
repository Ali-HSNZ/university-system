/**
 * @swagger
 * /class/list:
 *   get:
 *     tags: [Class]
 *     responses:
 *       200:
 *         description: لیست کلاس‌ها
 */

/**
 * @swagger
 * /class/{id}/info:
 *   get:
 *     tags: [Class]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: شناسه کلاس
 *     responses:
 *       200:
 *         description: اطلاعات کلاس
 */

/**
 * @swagger
 * /class/create:
 *   post:
 *     description: |
 *       این API برای ایجاد یک کلاس جدید در سیستم استفاده می‌شود.
 *       - **نکات مهم**:
 *         - `course_id` باید یک درس معتبر باشد.
 *         - مقدار `capacity` نشان‌دهنده تعداد دانشجویانی است که می‌توانند در کلاس ثبت‌نام کنند.
 *         - `status` وضعیت کلاس را مشخص می‌کند:
 *           - `open`: کلاس در حال ثبت‌نام است.
 *           - `closed`: ظرفیت کلاس پر شده یا انتخاب واحد پایان یافته است.
 *           - `canceled`: کلاس لغو شده است.
 *     tags: [Class]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - course_id
 *               - capacity
 *               - status
 *             properties:
 *               course_id:
 *                 type: integer
 *                 example: 5
 *                 description: شناسه درس مرتبط با این کلاس
 *               capacity:
 *                 type: integer
 *                 example: 30
 *                 description: حداکثر تعداد دانشجویانی که می‌توانند در این کلاس ثبت‌نام کنند
 *               status:
 *                 type: string
 *                 enum: ["open", "closed", "canceled"]
 *                 example: "open"
 *                 description: |
 *                   - `open`: کلاس در حال ثبت‌نام است.
 *                   - `closed`: ظرفیت کلاس پر شده یا انتخاب واحد پایان یافته است.
 *                   - `canceled`: کلاس لغو شده است.
 *     responses:
 *       201:
 *         description: کلاس با موفقیت ایجاد شد 
 *       400:
 *         description: خطای درخواست (پارامترهای نامعتبر)
 *       500:
 *         description: خطای سرور
 */

/**
 * @swagger
 * /class/{id}/delete:
 *   delete:
 *     tags: [Class]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: شناسه کلاس
 *     responses:
 *       200:
 *         description: کلاس با موفقیت حذف شد
 *       400:
 *         description: خطای درخواست (پارامترهای نامعتبر)
 *       500:
 *         description: خطای سرور
 */
