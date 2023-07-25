const express = require('express');
const router = express.Router();

//Middlewares
const checkAuth = require('../middlewares/checkAuth');
const checkExistedProject = require('../middlewares/checkExistedProject');
//Validators
const projectsValidator = require('../validators/projects.validator');

//Controller
const projectController = require('../controllers/projects.controller');

router.use(checkAuth);

//Add a project
/**
 * @openapi
 * '/api/project/add':
 *  post:
 *     tags:
 *     - Project
 *     summary: Add a project
 *     security:
 *      - Authorization: []
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - title
 *              - description
 *              - content
 *              - progress
 *              - start_date
 *              - end_date
 *            properties:
 *              title:
 *                type: string
 *              description:
 *                type: string
 *              content:
 *                type: string
 *              status:
 *                type: number
 *                default: 1
 *                enum: [1, 2, 3, 4]
 *              progress:
 *                type: number
 *                default: 0
 *                minimum: 0
 *                maximum: 100
 *              start_date:
 *                type: string
 *              end_date:
 *                type: string 
 *     responses:
 *      200:
 *        description: Add a project successfully
 *      400:
 *        description: Bad Request
 *      422: 
 *        description: Validation fields
 *      500:
 *        description: Server error
 */
router.post('/project/add', projectsValidator.validateAddProject, projectController.createProject);

//1.My projects
//Get all my projects
/**
 * @openapi
 * '/api/project/my-projects/page/{page}/get':
 *  get:
 *     tags:
 *     - Project
 *     summary: Get all my projects
 *     security:
 *      - Authorization: []
 *     parameters:
 *      - name: page
 *        in: path
 *        description: The page of the project (Pagination)
 *        required: true
 *        schema:
 *          type: number
 *          default: 1
 *     responses:
 *       200:
 *         description: Get all my projects successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.get('/project/my-projects/page/:page/get', projectsValidator.getMyProjects, projectController.getMyProjects);
//Get my projects by status
/**
 * @openapi
 * '/api/project/my-projects/status/{status}/page/{page}/get':
 *  get:
 *     tags:
 *     - Project
 *     summary: Get my projects by status
 *     security:
 *      - Authorization: []
 *     parameters:
 *      - name: status
 *        in: path
 *        description: The status of the project
 *        required: true
 *        schema:
 *          type: number
 *          enum: [1, 2, 3, 4]
 *      - name: page
 *        in: path
 *        description: The page of the project (Pagination)
 *        required: true
 *        schema:
 *          type: number
 *          default: 1
 *     responses:
 *       200:
 *         description: Get my projects by status successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.get('/project/my-projects/status/:status/page/:page/get', projectsValidator.getMyProjectsByStatus, projectController.getMyProjectsByStatus);
//Get my projects by title
/**
 * @openapi
 * '/api/project/my-projects/title/{title}/page/{page}/get':
 *  get:
 *     tags:
 *     - Project
 *     summary: Get my projects by title
 *     security:
 *      - Authorization: []
 *     parameters:
 *      - name: title
 *        in: path
 *        description: The title of the project
 *        required: true
 *      - name: page
 *        in: path
 *        description: The page of the project (Pagination)
 *        required: true
 *        schema:
 *          type: number
 *          default: 1
 *     responses:
 *       200:
 *         description: Get my projects by title successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.get('/project/my-projects/title/:title/page/:page/get', projectsValidator.getMyProjectsByTitle, projectController.getMyProjectsByTitle);

//2.My shared projects
//Get all my shared projects
/**
 * @openapi
 * '/api/project/my-shared-projects/page/{page}/get':
 *  get:
 *     tags:
 *     - Project
 *     summary: Get all my shared projects
 *     security:
 *      - Authorization: []
 *     parameters:
 *      - name: page
 *        in: path
 *        description: The page of the project (Pagination)
 *        required: true
 *        schema:
 *          type: number
 *          default: 1
 *     responses:
 *       200:
 *         description: Get all my shared projects successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.get('/project/my-shared-projects/page/:page/get', projectsValidator.getMySharedProjects ,projectController.getMySharedProjects);
//Get my shared projects by status
/**
 * @openapi
 * '/api/project/my-shared-projects/status/{status}/page/{page}/get':
 *  get:
 *     tags:
 *     - Project
 *     summary: Get my shared projects by status
 *     security:
 *      - Authorization: []
 *     parameters:
 *      - name: status
 *        in: path
 *        description: The status of the project
 *        required: true
 *        schema:
 *          type: number
 *          enum: [1, 2, 3, 4]
 *      - name: page
 *        in: path
 *        description: The page of the project (Pagination)
 *        required: true
 *        schema:
 *          type: number
 *          default: 1
 *     responses:
 *       200:
 *         description: Get my shared projects by status successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.get('/project/my-shared-projects/status/:status/page/:page/get', projectsValidator.getMySharedProjectsByStatus, projectController.getMySharedProjectsByStatus);
//Get my shared projects by title
/**
 * @openapi
 * '/api/project/my-shared-projects/title/{title}/page/{page}/get':
 *  get:
 *     tags:
 *     - Project
 *     summary: Get my shared projects by title
 *     security:
 *      - Authorization: []
 *     parameters:
 *      - name: title
 *        in: path
 *        description: The title of the project
 *        required: true
 *      - name: page
 *        in: path
 *        description: The page of the project (Pagination)
 *        required: true
 *        schema:
 *          type: number
 *          default: 1
 *     responses:
 *       200:
 *         description: Get my shared projects by title successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.get('/project/my-shared-projects/title/:title/page/:page/get', projectsValidator.getMySharedProjectsByTitle, projectController.getMySharedProjectsByTitle);

//Update a project
/**
 * @openapi
 * '/api/project/{id}/update':
 *  put:
 *     tags:
 *     - Project
 *     summary: Update a project
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
 *            properties:
 *              title:
 *                type: string
 *              description:
 *                type: string
 *              content:
 *                type: string
 *              status:
 *                type: number
 *                enum: [1, 2, 3, 4]
 *              progress:
 *                type: number
 *                minimum: 0
 *                maximum: 100
 *              start_date:
 *                type: string
 *              end_date:
 *                type: string 
 *     responses:
 *      200:
 *        description: Update project successfully
 *      400:
 *        description: Bad Request
 *      422: 
 *        description: Validation fields
 *      500:
 *        description: Server error
 */
router.put('/project/:id/update', projectsValidator.validateUpdateProject, checkExistedProject, projectController.updateProject);
//Invite user to a project
/**
 * @openapi
 * '/api/project/{id}/invite':
 *  post:
 *     tags:
 *     - Project
 *     summary: Invite an user to the project
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
 *              - user_code
 *              - permission
 *            properties:
 *              user_code:
 *                type: string
 *              permission:
 *                type: number
 *                enum: [1, 2, 3]
 *     responses:
 *      200:
 *        description: Invite an user to the project successfully
 *      400:
 *        description: Bad Request
 *      422: 
 *        description: Validation fields
 *      500:
 *        description: Server error
 */
router.post('/project/:id/invite', projectsValidator.inviteUserToProject, checkExistedProject, projectController.inviteUserToProject);
//Get members list of a project (Owner)
/**
 * @openapi
 * '/api/project/{id}/members/page/{page}/get':
 *  get:
 *     tags:
 *     - Project
 *     summary: Get members of the project
 *     security:
 *      - Authorization: []
 *     parameters:
 *      - name: id
 *        in: path
 *        description: The id of the project
 *        required: true
 *      - name: page
 *        in: path
 *        description: The page of the project (Pagination)
 *        required: true
 *        schema:
 *          type: number
 *          default: 1
 *     responses:
 *       200:
 *         description: Get members of the project successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.get('/project/:id/members/page/:page/get', projectsValidator.getMembers, checkExistedProject, projectController.getMembers);
//Change member permission
/**
 * @openapi
 * '/api/project/{id}/change-permission':
 *  put:
 *     tags:
 *     - Project
 *     summary: Change member's permission
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
 *            properties:
 *              user_id:
 *                type: string
 *              permission:
 *                type: number
 *                default: 1
 *     responses:
 *      200:
 *        description: Change member's permission successfully
 *      400:
 *        description: Bad Request
 *      422: 
 *        description: Validation fields
 *      500:
 *        description: Server error
 */
router.put('/project/:id/change-permission', projectsValidator.changeMemberPermission, checkExistedProject, projectController.changeMemberPermission); 
//Remove a member out of a project
/**
 * @openapi
 * '/api/project/{id}/member/{user_id}/remove':
 *  delete:
 *     tags:
 *     - Project
 *     summary: Remove a member out of the project
 *     security:
 *      - Authorization: []
 *     parameters:
 *      - name: id
 *        in: path
 *        description: The id of the project
 *        required: true
 *      - name: user_id
 *        in: path
 *        description: The user id
 *        required: true
 *     responses:
 *      200:
 *        description: Remove member of the project successfully
 *      400:
 *        description: Bad Request
 *      422: 
 *        description: Validation fields
 *      500:
 *        description: Server error
 */
router.delete('/project/:id/member/:user_id/remove', projectsValidator.removeMember, checkExistedProject, projectController.removeMember);
//Remove a project
/**
 * @openapi
 * '/api/project/{id}/remove':
 *  delete:
 *     tags:
 *     - Project
 *     summary: Remove a project
 *     security:
 *      - Authorization: []
 *     parameters:
 *      - name: id
 *        in: path
 *        description: The id of the project
 *        required: true
 *     responses:
 *      200:
 *        description: Remove project successfully
 *      400:
 *        description: Bad Request
 *      500:
 *        description: Server error
 */
router.delete('/project/:id/remove', projectsValidator.removeProject, checkExistedProject, projectController.removeProject);

module.exports = router;