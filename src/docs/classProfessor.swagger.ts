/**
 * @swagger
 * /class-professor/list:
 *   get:
 *     tags: [Class Professor]
 *     responses:
 *       200:
 *         description: لیست استادان در کلاس ها
 */

/**
 * @swagger
 * /class-professor/{id}/info:
 *   get:
 *     tags: [Class Professor]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: اطلاعات استاد در کلاس
 */

/**
 * @swagger
 * /class-professor/create:
 *   post:
 *     tags: [Class Professor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - class_id
 *               - professor_id
 *             properties:
 *               class_id:
 *                 type: integer
 *                 example: 1
 *               professor_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: استاد با موفقیت اضافه شد
 *       400:
 *         description: استاد یا کلاس یافت نشد
 */
