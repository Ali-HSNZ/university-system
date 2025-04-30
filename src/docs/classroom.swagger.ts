/**
 * @swagger
 * tags: [Classroom]
 */

/**
 * @swagger
 * /classroom/list:
 *   get:
 *     tags: [Classroom]
 *     responses:
 *       200:
 *         description: A list of classrooms
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /classroom/{id}/info:
 *   get:
 *     tags: [Classroom]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A classroom info
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 */

/**
 * @swagger
 * /classroom/create:
 *   post:
 *     tags: [Classroom]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - building_name
 *               - floor_number
 *               - capacity
 *             properties:
 *               name:
 *                 type: string
 *               building_name:
 *                 type: string
 *               floor_number:
 *                 type: number
 *               capacity:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: A classroom created
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /classroom/{id}/update:
 *   put:
 *     tags: [Classroom]
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
 *               - building_name
 *               - floor_number
 *               - capacity
 *             properties:
 *               name:
 *                 type: string
 *               building_name:
 *                 type: string
 *               floor_number:
 *                 type: number
 *               capacity:
 *                 type: number
 *     responses:
 *       200:
 *         description: A classroom updated
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /classroom/{id}/delete:
 *   delete:
 *     tags: [Classroom]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A classroom deleted
 *       401:
 *         description: Unauthorized
 */
