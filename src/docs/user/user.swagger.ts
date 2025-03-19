/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: |
 *       This endpoint allows a new user to register in the system.
 *       - **username**, **password** and **role** are required.
 *       - The `role` field determines the user's access level (e.g., student, professor, education_assistant, university_president).
 *       - If the user is a **student**:
 *         - `entry_year`, `degree_id` and `department_id` fields are **required**.
 *       - If the user is a **professor**:
 *         - `entry_year`, `degree_id` and `department_id` fields are **required**.
 *       - The `degree_id` and `department_id` fields are **foreign keys** linking to the respective tables.
 *       - `full_name` and `email` are **optional** fields.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *                 description: Unique username for the user
 *               password:
 *                 type: string
 *                 description: User's password (will be hashed)
 *               email:
 *                 type: string
 *                 nullable: true
 *                 description: User's email (optional)
 *               full_name:
 *                 type: string
 *                 nullable: true
 *                 description: Full name of the user (optional)
 *               role:
 *                 type: string
 *                 enum: [student, professor, education_assistant, university_president]
 *                 description: Role of the user in the system
 *               entry_year:
 *                 type: string
 *                 description: Year of entry (required for students)
 *               degree_id:
 *                 type: integer
 *                 description: Foreign key referencing the degree table
 *               department_id:
 *                 type: integer
 *                 description: Foreign key referencing the department table
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: User already exists
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns token
 *       401:
 *         description: Unauthorized, invalid credentials
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout the current user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
