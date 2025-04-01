/**
 * @swagger
 * /users:
 *   get:
 *     tags: [User]
 *     responses:
 *       200:   
 *         description: A list of users
 */

/**
 * @swagger
 * /users/search:
 *   get:
 *     tags: [User]
 *     summary: Find user by first_name, last_name, email, phone, national_code
 *     parameters:
 *       - name: first_name
 *         in: query
 *         required: false
 *         type: string
 *       - name: last_name
 *         in: query
 *         required: false
 *         type: string
 *       - name: email
 *         in: query
 *         required: false
 *         type: string
 *       - name: phone
 *         in: query
 *         required: false
 *         type: string
 *       - name: national_code
 *         in: query
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: A list of users
 *       400:
 *         description: Bad Request
 */

/**
 * @swagger
 * /users/{id}/info:
 *   get:
 *     tags: [User]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A user
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /users/{id}/update:
 *   put:
 *     tags: [User]
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
 *               - password
 *               - degree_id
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               password:
 *                 type: string
 *               military_status:
 *                 type: enum
 *                 enum:
 *                   - active
 *                   - completed
 *                   - exempted
 *                   - postponed
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               student_status:
 *                 type: enum
 *                 enum:
 *                   - active
 *                   - deActive
 *                   - studying
 *                   - graduate
 *               degree_id:
 *                 type: string
 *               entry_date:
 *                 type: string
 *                 example: "2025-03-22"
 *               entry_semester:
 *                 type: enum
 *                 enum:
 *                   - 1
 *                   - 2
 *               training_course_code:
 *                 type: enum
 *                 enum:
 *                   - 11
 *                   - 22
 *               department_id:
 *                 type: string
 *
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Bad Request
 */

/**
 * @swagger
 * /users/{id}/delete:
 *   delete:
 *     tags: [User]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
