/**
 * @swagger
 * /study/list:
 *   get:
 *     summary: Get all studies
 *     tags: [Study]
 *     responses:
 *       200:
 *         description: List of all studies
 */

/**
 * @swagger
 * /study/{id}/info/by-id:
 *   get:
 *     summary: Get a study by ID
 *     tags: [Study]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Study details
 */

/**
 * @swagger
 * /study/{name}/info/by-name:
 *   get:
 *     summary: Get a study by name
 *     tags: [Study]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Study details
 */

/**
 * @swagger
 * /study/create:
 *   post:
 *     summary: Create a new study
 *     tags: [Study]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *
 *     responses:
 *       201:
 *         description: Study created successfully
 */

/**
 * @swagger
 * /study/{id}/update:
 *   put:
 *     summary: Update a study
 *     tags: [Study]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Study updated successfully
 */

/**
 * @swagger
 * /study/{id}/delete:
 *   delete:
 *     summary: Delete a study
 *     tags: [Study]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Study deleted successfully
 */
