/**
 * @swagger
 * /degrees:
 *   get:
 *     tags: [Degree]
 *     responses:
 *       200:
 *         description: A list of degrees
 */

/**
 * @swagger
 * /degrees/{id}/info:
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
 * /degrees/create:
 *   post:
 *     tags: [Degree]
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
 * /degrees/{id}/update:
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
 * /degrees/{id}/delete:
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
