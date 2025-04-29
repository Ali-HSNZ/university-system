/**
 * @swagger
 *  /entry-year-course/list:
 *    get:
 *      tags: [Entry Year Course]
 *      description: Returns a list of all entry year courses with their associated degree, course, and department information
 *      responses:
 *       200:
 *         description: Successfully retrieved entry year courses
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
 *     summary: Get entry year course by ID
 *     description: Returns detailed information about a specific entry year course
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
 *               - year
 *               - course_id
 *               - degree_id
 *               - department_id
 *             properties:
 *               year:
 *                 type: string
 *                 description: The year of entry student
 *                 example: "1402"
 *               course_id:
 *                 type: integer
 *                 description: The course id
 *                 example: 1
 *               degree_id:
 *                 type: integer
 *                 description: The degree id
 *                 example: 1
 *               department_id:
 *                 type: integer
 *                 description: The department id
 *                 example: 1
 *     responses:
 *       201:
 *         description: Successfully created entry year course
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
 *         description: ID of the entry year course
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - year
 *               - course_id
 *               - degree_id
 *               - department_id
 *             properties:
 *               year:
 *                 type: string
 *                 description: The year of entry student
 *                 example: "1402"
 *               course_id:
 *                 type: integer
 *                 description: The course id
 *                 example: 1
 *               degree_id:
 *                 type: integer
 *                 description: The degree id
 *                 example: 1
 *               department_id:
 *                 type: integer
 *                 description: The department id
 *                 example: 1
 *     responses:
 *       200:
 *         description: Successfully updated entry year course
 *       404:
 *         description: Entry year course not found
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
 */
