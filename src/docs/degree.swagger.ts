/**
 * @swagger
 * /degree/list:
 *   get:
 *     tags: [Degree]
 *     responses:
 *       200:
 *         description: A list of degrees
 */

/**
 * @swagger
 * /degree/{id}/info:
 *   get:
 *     tags: [Degree]
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
 * /degree/create:
 *   post:
 *     tags: [Degree]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             required:
 *               - name
 *             example:
 *               name: "Degree Name"
 *     responses:
 *       201:
 *         description: A new degree
 *       400:
 *         description: Bad Request
 */

/**
 * @swagger
 * /degree/{id}/update:
 *   put:
 *     tags: [Degree]
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
 *             required:
 *               - name
 *             example:
 *               name: "Degree Name"
 *     responses:
 *       200:
 *         description: A updated degree
 *       400:
 *         description: Bad Request
 */

/**
 * @swagger
 * /degree/{id}/delete:
 *   delete:
 *     tags: [Degree]
 *     description:  (در صورتی ک هیچ کاربری در این مقطع تحصیلی وجود نداشته باشد) حذف یک مقطع تحصیلی
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
