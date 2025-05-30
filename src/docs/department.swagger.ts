/**
 * @swagger
 * /department/list:
 *   get:
 *     tags: [Department]
 *     responses:
 *       200:
 *         description: A list of departments
 */

/**
 * @swagger
 * /department/{id}/info:
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
 * /department/create:
 *   post:
 *     tags: [Department]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - name
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
 * /department/{id}/update:
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
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - name
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
 * /department/{id}/delete:
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
