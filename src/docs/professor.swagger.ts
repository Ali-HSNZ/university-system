/**
 * @swagger
 * /professor/list:
 *   get:
 *     tags: [Professor]
 *     responses:
 *       200:
 *         description: A list of professors
 */

/**
 * @swagger
 * /professor/{id}/delete:
 *   delete:
 *     tags: [Professor]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A list of professors
 *       404:
 *         description: Professor not found
 *       500:
 *         description: Internal server error
 */