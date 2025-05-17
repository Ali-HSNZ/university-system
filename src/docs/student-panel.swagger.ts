/**
 * @swagger
 * /student-panel/profile:
 *   get:
 *     tags: [Student Panel]
 *     description: Get student profile
 *     responses:
 *       200:
 *         description: Successfully retrieved student profile
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /student-panel/education-information:
 *   get:
 *     tags: [Student Panel]
 *     description: Get student education information
 *     responses:
 *       200:
 *         description: Successfully retrieved student education information
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /student-panel/current-semester-courses:
 *   get:
 *     tags: [Student Panel]
 *     description: Get student current semester courses
 *     responses:
 *       200:
 *         description: Successfully retrieved student current semester courses
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /student-panel/semesters-status:
 *   get:
 *     tags: [Student Panel]
 *     description: Get all semesters (enrollments) for the current student with details and courses
 *     responses:
 *       200:
 *         description: Successfully retrieved semesters
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /student-panel/current-semester-details:
 *   get:
 *     tags: [Student Panel]
 *     description: Get current active semester details or last semester if no active semester is available
 *     responses:
 *       200:
 *         description: Successfully retrieved semester details
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
 *                   example: "عملیات با موفقیت انجام شد"
 *                 data:
 *                   type: object
 *                   properties:
 *                     semester:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         academic_year:
 *                           type: string
 *                           example: "2023-2024"
 *                         term_number:
 *                           type: integer
 *                           example: 1
 *                         start_date:
 *                           type: string
 *                           example: "2023/07/01"
 *                         end_date:
 *                           type: string
 *                           example: "2023/10/30"
 *                         status:
 *                           type: string
 *                           example: "active"
 *                         is_current:
 *                           type: boolean
 *                           example: true
 *                     registration_status:
 *                       type: string
 *                       description: "Registration status can be: 'ثبت‌نام نشده', 'در انتظار تأیید معاون آموزشی', 'تأیید شده', or 'رد شده'"
 *                       example: "در انتظار تأیید معاون آموزشی"
 *                     registered_classes_count:
 *                       type: integer
 *                       example: 6
 *                     total_units:
 *                       type: integer
 *                       example: 18
 *       404:
 *         description: Student not found or no semesters available for the student
 *       500:
 *         description: Server error
 */

