/**
 * @swagger
 * /student/list:
 *   tags: [Student]
 *   get:
 *     tags: [Student]
 *     responses:
 *       200:
 *         description: A list of students
 *   401:
 *      description: Unauthorized
 *   400:
 *      description: Bad request
 *   500:
 *      description: Server error
 */

/**
 * @swagger
 * /student/info:
 *   tags: [Student]
 *   get:
 *     tags: [Student]
 *     responses:
 *       200:
 *         description: A student
 *   401:
 *      description: Unauthorized
 *   400:
 *      description: Bad request
 *   500:
 *      description: Server error
 */

/**
 * @swagger
 * /student/{id}/info:
 *   get:
 *      tags: [Student]
 *      parameters:
 *        - name: id
 *          in: path
 *          description: student id
 *          required: true
 *          type: number
 *      responses:
 *          200:
 *              description: A student
 *          401:
 *              description: Unauthorized
 *          400:
 *              description: Bad request
 *          500:
 *              description: Server error
 */
