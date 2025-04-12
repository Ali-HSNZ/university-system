/**
 * @swagger
 * /enrollment/list:
 *   get:
 *     tags: [Enrollment]
 *     summary: دریافت همه ثبت نام ها
 *     description: دریافت همه ثبت نام ها
 *     responses:
 *       "200":
 *         description: ثبت نام های دانشجو با موفقیت دریافت شد
 */

/**
 * @swagger
 * /enrollment/student/{userId}:
 *   get:
 *     tags: [Enrollment]
 *     summary: دریافت ثبت نام های یک دانشجو
 *     description: دریافت همه ثبت نام های یک دانشجو
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: شناسه دانشجو
 *     responses:
 *       "200":
 *         description: ثبت نام های دانشجو با موفقیت دریافت شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Student enrollments retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       student_id:
 *                         type: integer
 *                         example: 1
 *                       class_schedule_id:
 *                         type: integer
 *                         example: 1
 *                       status:
 *                         type: string
 *                         example: "pending"
 *                       Class:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           course_id:
 *                             type: integer
 *                             example: 5
 *                           capacity:
 *                             type: integer
 *                             example: 30
 *                           enrolled_students:
 *                             type: integer
 *                             example: 15
 *                           status:
 *                             type: string
 *                             example: "open"
 *       "400":
 *         description: Bad request - Invalid student ID
 */

/**
 * @swagger
 * /enrollment/class/{classId}:
 *   get:
 *     tags: [Enrollment]
 *     summary: Get class enrollments
 *     description: Retrieves all enrollments for a specific class
 *     parameters:
 *       - name: classId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Class ID
 *     responses:
 *       "200":
 *         description: Class enrollments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Class enrollments retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       student_id:
 *                         type: integer
 *                         example: 1
 *                       class_schedule_id:
 *                         type: integer
 *                         example: 1
 *                       status:
 *                         type: string
 *                         example: "pending"
 *                       User:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: "John Doe"
 *                           email:
 *                             type: string
 *                             example: "john@example.com"
 *       "400":
 *         description: Bad request - Invalid class ID
 */

/**
 * @swagger
 * /enrollment/{id}:
 *   get:
 *     tags: [Enrollment]
 *     summary: Get enrollment details
 *     description: Retrieves enrollment information by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Enrollment ID
 *     responses:
 *       "200":
 *         description: Enrollment retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Enrollment retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     student_id:
 *                       type: integer
 *                       example: 1
 *                     class_schedule_id:
 *                       type: integer
 *                       example: 1
 *                     status:
 *                       type: string
 *                       example: "pending"
 *                     User:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: "John Doe"
 *                         email:
 *                           type: string
 *                           example: "john@example.com"
 *                     Class:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         course_id:
 *                           type: integer
 *                           example: 5
 *                         capacity:
 *                           type: integer
 *                           example: 30
 *                         enrolled_students:
 *                           type: integer
 *                           example: 15
 *                         status:
 *                           type: string
 *                           example: "open"
 *       "404":
 *         description: Enrollment not found
 */


/**
 * @swagger
 * /enrollment/create:
 *   post:
 *     tags: [Enrollment]
 *     summary: Create a new enrollment
 *     description: Registers a student for a class
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - student_id
 *               - class_schedule_id
 *             properties:
 *               student_id:
 *                 type: integer
 *                 description: شناسه دانشجو
 *                 example: 1
 *               class_schedule_id:
 *                 type: integer
 *                 description: شناسه برنامه جلسه
 *                 example: 1
 *     responses:
 *       "201":
 *         description: ثبت نام با موفقیت انجام شد
 *       "400":
 *         description: درخواست نامعتبر - داده های ورودی معتبر نیست یا دانشجو قبلا ثبت نام کرده است
 *       "404":
 *         description: دانشجو یا برنامه جلسه یافت نشد
 */

/**
 * @swagger
 * /enrollment/{id}/update:
 *   put:
 *     tags: [Enrollment]
 *     summary: Update enrollment status
 *     description: Updates the status of an enrollment (pending, approved, rejected)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Enrollment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *                 description: New status for the enrollment
 *                 example: "approved"
 *     responses:
 *       "200":
 *         description: Enrollment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Enrollment updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     student_id:
 *                       type: integer
 *                       example: 1
 *                     class_schedule_id:
 *                       type: integer
 *                       example: 1
 *                     status:
 *                       type: string
 *                       example: "approved"
 *       "400":
 *         description: Bad request - Invalid input data
 *       "404":
 *         description: Enrollment not found
 */

/**
 * @swagger
 * /enrollment/{id}/delete:
 *   delete:
 *     tags: [Enrollment]
 *     summary: Delete enrollment
 *     description: Removes an enrollment and updates class capacity
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Enrollment ID
 *     responses:
 *       "200":
 *         description: Enrollment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Enrollment deleted successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: true
 *                     message:
 *                       type: string
 *                       example: "Enrollment deleted successfully"
 *       "404":
 *         description: Enrollment not found
 */
