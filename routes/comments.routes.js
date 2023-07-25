const express = require('express');
const router = express.Router();

//Middlewares
const checkAuth = require('../middlewares/checkAuth');
const checkExistedProject = require('../middlewares/checkExistedProject');

//Validators
const commentsValidator = require('../validators/comments.validator');

//Controller
const commentController = require('../controllers/comments.controller');

router.use(checkAuth);

//Comment at a project
/**
 * @openapi
 * '/api/comment/project/{id}/post':
 *  post:
 *     tags:
 *     - Comment
 *     summary: Post a comment
 *     security:
 *      - Authorization: []
 *     parameters:
 *      - name: id
 *        in: path
 *        description: The id of the project
 *        required: true
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - content
 *            properties:
 *              content:
 *                type: string
 *     responses:
 *      200:
 *        description: Post comment successfully
 *      400:
 *        description: Bad Request
 *      422: 
 *        description: Validation fields
 *      500:
 *        description: Server error
 */
router.post('/comment/project/:id/post', commentsValidator.commentProject, checkExistedProject, commentController.commentProject);
//Get comments by project
/**
 * @openapi
 * '/api/comments/project/{id}/page/{page}/get':
 *  get:
 *     tags:
 *     - Comment
 *     summary: Get comments by project
 *     security:
 *      - Authorization: []
 *     parameters:
 *      - name: id
 *        in: path
 *        description: The id of the project
 *        required: true
 *      - name: page
 *        in: path
 *        description: The page of the comment (Pagination)
 *        required: true
 *        schema:
 *          type: number
 *          default: 1
 *     responses:
 *      200:
 *        description: Get comments by project successfully
 *      400:
 *        description: Bad Request
 *      422: 
 *        description: Invalid params
 *      500:
 *        description: Server error
 */
router.get('/comments/project/:id/page/:page/get', commentsValidator.getComments, checkExistedProject, commentController.getCommentsByProject);
//Update comment
/**
 * @openapi
 * '/api/comment/{id}/update':
 *  put:
 *     tags:
 *     - Comment
 *     summary: Update a comment
 *     security:
 *      - Authorization: []
 *     parameters:
 *      - name: id
 *        in: path
 *        description: The id of the comment
 *        required: true
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - content
 *            properties:
 *              content:
 *                type: string
 *     responses:
 *      200:
 *        description: Update comment successfully
 *      400:
 *        description: Bad Request
 *      422: 
 *        description: Validation fields
 *      500:
 *        description: Server error
 */
router.put('/comment/:id/update', commentsValidator.updateComment, commentController.updateComment);
//Remove comment
/**
 * @openapi
 * '/api/comment/{id}/remove':
 *  delete:
 *     tags:
 *     - Comment
 *     summary: Remove a comment
 *     security:
 *      - Authorization: []
 *     parameters:
 *      - name: id
 *        in: path
 *        description: The id of the comment
 *        required: true
 *     responses:
 *      200:
 *        description: Remove comment successfully
 *      400:
 *        description: Bad Request
 *      500:
 *        description: Server error
 */
router.delete('/comment/:id/remove', commentsValidator.removeComment, commentController.removeComment);

module.exports = router;