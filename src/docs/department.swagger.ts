/**
 * @swagger
 * /departments:
 *   get:
 *     tags: [Department]
 *     summary: Get all departments
 *     description: Get all departments from the database
 *     responses:
 *       200:
 *         description: A list of departments
 */

/**
 * @swagger
 * /departments/{id}/info:
 *   get:
 *     tags: [Department]
 *     summary: Get department by id
 *     description: Get department by id
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A department
 *       400:
 *         description: Bad Request
 */

/**
 * @swagger
 * /departments/create:
 *   post:
 *     tags: [Department]
 *     summary: Create a new department
 *     description: Create a new department
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               department_name:
 *                 type: string
 *                 example: 'مهندسی کامپیوتر'
 *     responses:
 *       200:
 *         description: A new department
 *       400:
 *         description: Bad Request
 */

/**
 * @swagger
 * /departments/{id}/update:
 *   put:
 *     tags: [Department]
 *     summary: Update a department
 *     description: Update a department
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: 'مهندسی کامپیوتر'
 *     responses:
 *       200:
 *         description: A updated department
 *       400:
 *         description: Bad Request
 */

/**
 * @swagger
 * /departments/{id}/delete:
 *   delete:
 *     tags: [Department]
 *     summary: Delete a department
 *     description: Delete a department
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A deleted department
 *       400:
 *         description: Bad Request
 */
