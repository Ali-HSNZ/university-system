/**
 * @swagger
 * /semester/list:
 *   get:
 *     tags: [Semester]
 *     responses:
 *       200:
 *         description: A list of semesters
 */

/**
 * @swagger
 * /semester/{id}/info:
 *   get:
 *     tags: [Semester]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A list of semesters
 */

/**
 * @swagger
 * /semester/create:
 *   post:
 *     tags: [Semester]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - academic_year
 *               - term_number
 *               - start_date
 *               - end_date
 *               - status
 *             properties:
 *               academic_year:
 *                 type: string
 *                 example: "2024-2025"
 *               term_number:
 *                 type: enum
 *                 enum:
 *                   - 1
 *                   - 2
 *                 example: "1"
 *               start_date:
 *                 type: string
 *                 example: "2024-01-01"
 *               end_date:
 *                 type: string
 *                 example: "2024-06-30"
 *               status:
 *                 type: enum
 *                 enum:
 *                   - upcoming
 *                   - ongoing
 *                   - completed
 *                 example: "upcoming"
 *     responses:
 *       200:
 *         description: A list of semesters
 */



/**
 * @swagger
 * /semester/{id}/update:
 *   put:
 *     tags: [Semester]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - academic_year
 *               - term_number
 *               - start_date
 *               - end_date
 *               - status
 *             properties:
 *               academic_year:
 *                 type: string
 *                 example: "2024-2025"
 *               term_number:
 *                 type: enum
 *                 enum:
 *                   - 1
 *                   - 2
 *                 example: "1"
 *               start_date:
 *                 type: string
 *                 example: "2024-01-01"
 *               end_date:
 *                 type: string
 *                 example: "2024-06-30"
 *               status:
 *                 type: enum
 *                 enum:
 *                   - upcoming
 *                   - ongoing
 *                   - completed
 *                 example: "upcoming"
 *     responses:
 *       200:
 *         description: A list of semesters
 */

/**
 * @swagger
 * /semester/{id}/delete:
 *   delete:
 *     tags: [Semester]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: deleted successfully
 */
