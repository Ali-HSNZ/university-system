/**
 * @swagger
 * /student/list:
 *   get:
 *     tags: [Student]
 *     responses:
 *       200:
 *         description: A list of students
 *         content:
 *           application/json:
 *             schema:
 *
 * /student/available-classes:
 *   get:
 *     tags: [Student]
 *     summary: Get available classes for enrollment
 *     description: Returns a list of available classes with their professors for student enrollment
 *     parameters:
 *       - in: query
 *         name: semester_id
 *         schema:
 *           type: integer
 *         description: Optional semester ID to filter classes
 *     responses:
 *       200:
 *         description: Successfully retrieved available classes
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
 *                   example: عملیات با موفقیت انجام شد
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       capacity:
 *                         type: integer
 *                         example: 30
 *                       enrolled_students:
 *                         type: integer
 *                         example: 15
 *                       status:
 *                         type: string
 *                         enum: [open, closed, canceled]
 *                         example: open
 *                       course:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           title:
 *                             type: string
 *                             example: ریاضی 1
 *                           code:
 *                             type: string
 *                             example: MATH101
 *                           unit_count:
 *                             type: integer
 *                             example: 3
 *                       semester:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           academic_year:
 *                             type: string
 *                             example: 2023-2024
 *                           term_number:
 *                             type: string
 *                             example: 1
 *                       schedules:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 1
 *                             day_of_week:
 *                               type: string
 *                               example: 1
 *                             start_time:
 *                               type: string
 *                               example: 08:00:00
 *                             end_time:
 *                               type: string
 *                               example: 10:00:00
 *                             professor:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: integer
 *                                   example: 1
 *                                 name:
 *                                   type: string
 *                                   example: دکتر محمدی
 *                                 faculty_number:
 *                                   type: string
 *                                   example: F12345
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
