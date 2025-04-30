/**
 * @swagger
 *  /entry-year-course/list:
 *    get:
 *      tags: [Entry Year Course]
 *      description: Returns a list of all entry years with their associated degree, course, and department information
 *      responses:
 *       200:
 *         description: Successfully retrieved entry years
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /entry-year-course/{id}/info:
 *   get:
 *     tags: [Entry Year Course]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the entry year course
 *     responses:
 *       200:
 *         description: Successfully retrieved entry year course
 *       404:
 *         description: Entry year course not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /entry-year-course/create:
 *   post:
 *     tags: [Entry Year Course]
 *     summary: Create new entry year course
 *     description: Creates a new entry year course
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - entry_year_id
 *               - course_id
 *             properties:
 *               entry_year_id:
 *                 type: integer
 *                 description: شناسه سال ورود
 *                 example: 1
 *               course_id:
 *                 type: integer
 *                 description: شناسه درس
 *                 example: 1
 *     responses:
 *       201:
 *         description: created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /entry-year-course/{id}/update:
 *   put:
 *     tags: [Entry Year Course]
 *     summary: Update entry year course
 *     description: Updates an existing entry year course
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the entry year
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - entry_year_id
 *               - course_id
 *             properties:
 *               entry_year_id:
 *                 type: integer
 *                 description: شناسه سال ورود
 *                 example: 1
 *               course_id:
 *                 type: integer
 *                 description: شناسه درس
 *                 example: 1
 *     responses:
 *       200:
 *         description: updated successfully
 *       404:
 *         description: Entry year not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /entry-year-course/{id}/delete:
 *   delete:
 *     tags: [Entry Year Course]
 *     summary: Delete entry year course
 *     description: Deletes an existing entry year course
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the entry year course
 *     responses:
 *       200:
 *         description: Successfully deleted entry year course
 *       404:
 *         description: Entry year course not found
 *       500:
 *         description: Server error
 */
