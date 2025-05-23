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
 * /student-panel/enrollment-status:
 *   get:
 *     tags: [Student Panel]
 *     description: Get student enrollment status
 *     responses:
 *       200:
 *         description: Successfully retrieved student enrollment status
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

/**
 *  @swagger
 * /student-panel/required-courses:
 *   get:
 *     tags: [Student Panel]
 *     description: Get student required courses
 *     responses:
 *       200:
 *         description: Successfully retrieved student required courses
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /student-panel/important-dates:
 *   get:
 *     tags: [Student Panel]
 *     description: Get student important dates
 *     responses:
 *       200:
 *         description: Successfully retrieved student important dates
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
 *       404:
 *         description: Student not found or no semesters available for the student
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /student-panel/weekly-schedule:
 *   get:
 *     tags: [Student Panel]
 *     description: Get student weekly schedule
 *     responses:
 *       200:
 *         description: Successfully retrieved student weekly schedule
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
