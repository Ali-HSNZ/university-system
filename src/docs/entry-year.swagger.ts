/**
 * @swagger
 *  /entry-year/list:
 *    get:
 *      tags: [Entry Year]
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
 * /entry-year/{id}/info:
 *   get:
 *     tags: [Entry Year]
 *     summary: Get entry year by ID
 *     description: Returns detailed information about a specific entry year
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the entry year
 *     responses:
 *       200:
 *         description: Successfully retrieved entry year
 *       404:
 *         description: Entry year not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /entry-year/create:
 *   post:
 *     tags: [Entry Year]
 *     summary: Create new entry year
 *     description: Creates a new entry year
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - year
 *               - study_id
 *               - degree_id
 *               - department_id
 *             properties:
 *               year:
 *                 type: string
 *                 description: سال ورود دانشجو
 *                 example: "1402"
 *               study_id:
 *                 type: integer
 *                 description: شناسه رشته تحصیلی
 *                 example: 1
 *               degree_id:
 *                 type: integer
 *                 description: شناسه مقطع تحصیلی
 *                 example: 1
 *               department_id:
 *                 type: integer
 *                 description: شناسه گروه آموزشی
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
 * /entry-year/{id}/update:
 *   put:
 *     tags: [Entry Year]
 *     summary: Update entry year
 *     description: Updates an existing entry year
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
 *               - year
 *               - study_id
 *               - degree_id
 *               - department_id
 *             properties:
 *               year:
 *                 type: string
 *                 description: سال ورود دانشجو
 *                 example: "1402" 
 *               study_id:
 *                 type: integer
 *                 description: شناسه رشته تحصیلی
 *                 example: 1
 *               degree_id:
 *                 type: integer
 *                 description: شناسه مقطع تحصیلی
 *                 example: 1
 *               department_id:
 *                 type: integer
 *                 description: شناسه گروه آموزشی
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
 * /entry-year/{id}/delete:
 *   delete:
 *     tags: [Entry Year]
 *     summary: Delete entry year
 *     description: Deletes an existing entry year
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the entry year
 *     responses:
 *       200:
 *         description: Successfully deleted entry year
 *       404:
 *         description: Entry year not found
 *       500:
 */
