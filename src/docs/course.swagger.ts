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
 *               - theory_unit
 *               - practical_unit
 *             properties:
 *               name:
 *                 type: string
 *                 default: ''
 *               theory_unit:
 *                 type: number
 *                 default: 0
 *               practical_unit:
 *                 type: number
 *                 default: 0
 *     responses:
 *       200:
 *         description: A course
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
 *               - theory_unit
 *               - practical_unit
 *             properties:
 *               name:
 *                 type: string
 *                 default: ''
 *               theory_unit:
 *                 type: number
 *                 default: 0
 *               practical_unit:
 *                 type: number
 *                 default: 0
 *     responses:
 *       200:
 *         description: A course updated successfully
 *       400:
 *         description: Bad Request
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
