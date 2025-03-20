/**
 * @swagger
 * /degrees:
 *   get:
 *     tags: [Degree]
 *     summary: Get all degrees
 *     description: Get all degrees from the database
 *     responses:
 *       200:
 *         description: A list of degrees
 */

/**
 * @swagger
 * /degrees/{id}/info:
 *   get:
 *     tags: [Degree]
 *     summary: Get a degree by id
 *     description: Get a degree by id
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A degree
 *       400:
 *         description: Bad Request
 */

/**
 * @swagger
 * /degrees/create:
 *   post:
 *     tags: [Degree]
 *     summary: Create a new degree
 *     description: Create a new degree
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               degree_name:
 *                 type: string
 *             required:
 *               - degree_name
 *             example:
 *               degree_name: "Degree Name"
 *     responses:
 *       201:
 *         description: A new degree
 *       400:
 *         description: Bad Request
 */

/**
 * @swagger
 * /degrees/{id}/delete:
 *   delete:
 *     tags: [Degree]
 *     summary: Delete a degree
 *     description: Delete a degree
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A deleted degree
 *       400:
 *         description: Bad Request
 */
