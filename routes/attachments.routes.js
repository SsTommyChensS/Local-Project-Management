const express = require('express');
const router = express.Router();

//Middlewares
const checkAuth = require('../middlewares/checkAuth');
const checkExistedProject = require('../middlewares/checkExistedProject');
const uploadAttachments = require('../middlewares/uploadAttachment');

//Validator
const attachmentsValidator = require('../validators/attachments.validator');

//Controller
const attachmentController = require('../controllers/attachments.controller');

router.use(checkAuth);

//Add attachments
/**
 * @openapi
 * '/api/attachments/project/{id}/add':
 *  post:
 *     tags:
 *     - Attachment
 *     summary: Add attachments
 *     security:
 *      - Authorization: []
 *     parameters:
 *      - name: id
 *        in: path
 *        description: The id of the project
 *        required: true
 *     requestBody:
 *      content:
 *       multipart/form-data:
 *          schema:
 *              type: object
 *              properties:
 *                  attachments:
 *                      type: array
 *                      items:
 *                          type: string
 *                          format: binary
 *     responses:
 *      200:
 *        description: Add attachments successfully
 *      400:
 *        description: Bad Request
 *      500:
 *        description: Server error
 */
router.post('/attachments/project/:id/add', checkExistedProject, uploadAttachments.array("attachments", 10), attachmentController.addAttachments);
//Get attachments by project
/**
 * @openapi
 * '/api/attachments/project/{id}/page/{page}/get':
 *  get:
 *     tags:
 *     - Attachment
 *     summary: Get attachments by project
 *     security:
 *      - Authorization: []
 *     parameters:
 *      - name: id
 *        in: path
 *        description: The id of the project
 *        required: true
 *      - name: page
 *        in: path
 *        description: The page of the attachment (Pagination)
 *        required: true
 *        schema:
 *          type: number
 *          default: 1
 *     responses:
 *      200:
 *        description: Get attachments by project successfully
 *      400:
 *        description: Bad Request
 *      422:
 *        description: Invalid params
 *      500:
 *        description: Server error
 */
router.get('/attachments/project/:id/page/:page/get', attachmentsValidator.getAttachments, checkExistedProject, attachmentController.getAttachmentsByProject);
//Remove attachment
/**
 * @openapi
 * '/api/attachment/{id}/remove':
 *  delete:
 *     tags:
 *     - Attachment
 *     summary: Remove an attachment
 *     security:
 *      - Authorization: []
 *     parameters:
 *      - name: id
 *        in: path
 *        description: The id of the attachment
 *        required: true
 *     responses:
 *      200:
 *        description: Remove attachment successfully
 *      400:
 *        description: Bad Request
 *      500:
 *        description: Server error
 */
router.delete('/attachment/:id/remove', attachmentController.removeAttachment);

module.exports = router;