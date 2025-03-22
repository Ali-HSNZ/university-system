/**
 * @swagger
 * /departments:
 *   get:
 *     tags: [Department]
 *     responses:
 *       200:
 *         description: A list of departments
 */

/**
 * @swagger
 * /departments/{id}/info:
 *   get:
 *     tags: [Department]
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
 *         description: A new department
 *       400:
 *         description: Bad Request
 */

/**
 * @swagger
 * /departments/{id}/update:
 *   put:
 *     tags: [Department]
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
 *     description: (در صورتی ک هیچ کاربری در این گروه آموزشی وجود نداشته باشد) حذف یک گروه آموزشی
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
