/**
 * @swagger
 * /important-date/list:
 *   get:
 *     tags: [Important Dates]
 *     responses:
 *       200:
 *         description: A list of important dates
 */

/**
 * @swagger
 * /important-date/{id}/info:
 *   get:
 *     tags: [Important Dates]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: number
 *     responses:
 *       200:
 *         description: A important date
 */

/**
 * @swagger
 * /important-date/create:
 *   post:
 *     tags: [Important Dates]
 *     description: |
 *       - **type**: نوع
 *          - **enrollment**: ثبت نام (انتخاب واحد)
 *          - **add_drop**: حذف و اضافه
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - start_date
 *               - end_date
 *               - entry_year
 *               - department_id
 *               - degree_id
 *               - study_id
 *             properties:
 *               type:
 *                 type: string
 *                 description: نوع
 *                 enum:
 *                   - enrollment
 *                   - add_drop
 *               start_date:
 *                 type: string
 *                 description: تاریخ شروع
 *                 example: 1404-01-01T12:00
 *               end_date:
 *                 type: string
 *                 description: تاریخ پایان
 *                 example: 1405-01-01T16:00
 *               entry_year:
 *                 description: سال ورود
 *                 example: 1404
 *               department_id:
 *                 type: number
 *                 description: شناسه گروه آموزشی
 *                 example: 1
 *               degree_id:
 *                 type: number
 *                 description: شناسه مقطع تحصیلی
 *                 example: 1
 *               study_id:
 *                 type: number
 *                 description: شناسه رشته تحصیلی
 *                 example: 1
 *     responses:
 *       201:
 *         description: Important date created successfully
 *       400:
 *         description: Bad Request
 */

/**
 * @swagger
 * /important-date/{id}/update:
 *   put:
 *     tags: [Important Dates]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - start_date
 *               - end_date
 *               - entry_year
 *               - department_id
 *               - degree_id
 *               - study_id
 *             properties:
 *               type:
 *                 type: string
 *                 description: نوع
 *                 enum:
 *                   - enrollment
 *                   - add_drop
 *               start_date:
 *                 type: string
 *                 description: تاریخ شروع
 *                 example: 1404-01-01T12:00
 *               end_date:
 *                 type: string
 *                 description: تاریخ پایان
 *                 example: 1405-01-01T16:00
 *               entry_year:
 *                 type: number
 *                 description: سال ورود
 *                 example: 1404
 *               department_id:
 *                 type: number
 *                 description: شناسه گروه آموزشی
 *                 example: 1
 *               degree_id:
 *                 type: number
 *                 description: شناسه مقطع تحصیلی
 *                 example: 1
 *               study_id:
 *                 type: number
 *                 description: شناسه رشته تحصیلی
 *     responses:
 *       200:
 *         description: Important date updated successfully
 */

/**
 * @swagger
 * /important-date/{id}/delete:
 *   delete:
 *     tags: [Important Dates]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: number
 *     responses:
 *       200:
 *         description: Important date deleted successfully
 *       404:
 *         description: Important date not found
 *       500:
 *         description: Internal server error
 */
