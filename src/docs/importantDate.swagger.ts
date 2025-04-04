/**
 * @swagger
 * /important-date/list:
 *   get:
 *     tags: [Important Date]
 *     responses:
 *       200:
 *         description: A list of important dates
 */

/**
 * @swagger
 * /important-date/{id}/info:
 *   get:
 *     tags: [Important Date]
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
 *     tags: [Important Date]
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
 *             properties:
 *               type:
 *                 type: string
 *                 description: نوع
 *                 enum:
 *                   - course_selection
 *                   - add_drop
 *               start_date:
 *                 type: string
 *                 description: تاریخ شروع
 *               end_date:
 *                 type: string
 *                 description: تاریخ پایان
 *               entry_year:
 *                 type: number
 *                 description: سال ورود
 *               department_id:
 *                 type: number
 *                 description: شناسه گروه آموزشی
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
 *     tags: [Important Date]
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
 *             properties:
 *               type:
 *                 type: string
 *                 description: نوع
 *                 enum:
 *                   - course_selection
 *                   - add_drop
 *               start_date:
 *                 type: string
 *                 description: تاریخ شروع
 *               end_date:
 *                 type: string
 *                 description: تاریخ پایان
 *               entry_year:
 *                 type: number
 *                 description: سال ورود
 *               department_id:
 *                 type: number
 *                 description: شناسه گروه آموزشی
 *     responses:
 *       200:
 *         description: Important date updated successfully
 */
