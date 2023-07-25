const express = require('express');
const router = express.Router();

//Middlewares
const checkAuth = require('../middlewares/checkAuth');
const checkExistedProject = require('../middlewares/checkExistedProject');

//Validators
const tasksValidator = require('../validators/tasks.validator');

//Controller
const taskController = require('../controllers/tasks.controller');

router.use(checkAuth);

//Add task
/**
 * @openapi
 * '/api/task/project/{id}/add':
 *  post:
 *     tags:
 *     - Task
 *     summary: Add a task
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
 *              - title
 *              - content
 *              - start_date
 *              - end_date
 *              - estimate_time
 *              - asignee
 *            properties:
 *              title:
 *                type: string
 *              content:
 *                type: string
 *              status:
 *                type: number
 *                default: 1
 *              start_date:
 *                type: string
 *              end_date:
 *                type: string
 *              estimate_time:
 *                type: number
 *              asignee:
 *                type: string
 *     responses:
 *      200:
 *        description: Add task successfully
 *      400:
 *        description: Bad Request
 *      422: 
 *        description: Validation fields
 *      500:
 *        description: Server error
 */
router.post('/task/project/:id/add', tasksValidator.addTask, checkExistedProject, taskController.addTask);
//Get tasks by project
/**
 * @openapi
 * '/api/tasks/project/{id}/page/{page}/get':
 *  get:
 *     tags:
 *     - Task
 *     summary: Get tasks by project
 *     security:
 *      - Authorization: []
 *     parameters:
 *      - name: id
 *        in: path
 *        description: The id of the project
 *        required: true
 *      - name: page
 *        in: path
 *        description: The page of the task
 *        required: true
 *        schema:
 *          type: number
 *          default: 1
 *     responses:
 *      200:
 *        description: Get tasks by project successfully
 *      400:
 *        description: Bad Request
 *      422:
 *        description: Invalid params
 *      500:
 *        description: Server error
 */
router.get('/tasks/project/:id/page/:page/get', tasksValidator.getTasks, checkExistedProject ,taskController.getTasksByProject);
//Get tasks by project and member
/**
 * @openapi
 * '/api/tasks/project/{id}/member/{member_id}/page/{page}/get':
 *  get:
 *     tags:
 *     - Task
 *     summary: Get tasks by project and member
 *     security:
 *      - Authorization: []
 *     parameters:
 *      - name: id
 *        in: path
 *        description: The id of the project
 *        required: true
 *      - name: member_id
 *        in: path
 *        description: The id of the member
 *        required: true
 *      - name: page
 *        in: path
 *        description: The page of the task
 *        required: true
 *        schema:
 *          type: number
 *          default: 1
 *     responses:
 *      200:
 *        description: Get tasks by project and member successfully
 *      400:
 *        description: Bad Request
 *      422:
 *        description: Invalid params
 *      500:
 *        description: Server error
 */
router.get('/tasks/project/:id/member/:member_id/page/:page/get', tasksValidator.getTasksByMember, checkExistedProject, taskController.getTasksByMember);
//Get tasks by project and tasks's status
/**
 * @openapi
 * '/api/tasks/project/{id}/status/{status}/page/{page}/get':
 *  get:
 *     tags:
 *     - Task
 *     summary: Get tasks by project and task's status
 *     security:
 *      - Authorization: []
 *     parameters:
 *      - name: id
 *        in: path
 *        description: The id of the project
 *        required: true
 *      - name: status
 *        in: path
 *        description: The status of the task
 *        required: true
 *        schema:
 *          type: number
 *          enum: [1, 2, 3, 4]
 *      - name: page
 *        in: path
 *        description: The page of the task
 *        required: true
 *        schema:
 *          type: number
 *          default: 1
 *     responses:
 *      200:
 *        description: Get tasks by project and task's status successfully
 *      400:
 *        description: Bad Request
 *      422:
 *        description: Invalid params
 *      500:
 *        description: Server error
 */
router.get('/tasks/project/:id/status/:status/page/:page/get', tasksValidator.getTasksByStatus, checkExistedProject, taskController.getTasksByStatus)
//Get tasks by title
/**
 * @openapi
 * '/api/tasks/project/{id}/title/{title}/page/{page}/get':
 *  get:
 *     tags:
 *     - Task
 *     summary: Get tasks by project task's and task's title
 *     security:
 *      - Authorization: []
 *     parameters:
 *      - name: id
 *        in: path
 *        description: The id of the project
 *        required: true
 *      - name: title
 *        in: path
 *        description: The title of the task
 *        required: true
 *      - name: page
 *        in: path
 *        description: The page of the task
 *        required: true
 *        schema:
 *          type: number
 *          default: 1
 *     responses:
 *      200:
 *        description: Get tasks by project and task's title successfully
 *      400:
 *        description: Bad Request
 *      422:
 *        description: Invalid params
 *      500:
 *        description: Server error
 */
router.get('/tasks/project/:id/title/:title/page/:page/get', tasksValidator.getTasksByTitle, checkExistedProject, taskController.getTasksByTitle)
//Update task
/**
 * @openapi
 * '/api/task/{id}/update':
 *  put:
 *     tags:
 *     - Task
 *     summary: Update a task
 *     security:
 *      - Authorization: []
 *     parameters:
 *      - name: id
 *        in: path
 *        description: The id of the task
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
 *              content:
 *                type: string
 *              status:
 *                type: number
 *                default: 1
 *              start_date:
 *                type: string
 *              end_date:
 *                type: string
 *              estimate_time:
 *                type: number
 *     responses:
 *      200:
 *        description: Update task successfully
 *      400:
 *        description: Bad Request
 *      422: 
 *        description: Validation fields
 *      500:
 *        description: Server error
 */
router.put('/task/:id/update', tasksValidator.updateTask, taskController.updateTask);
//Remove task
/**
 * @openapi
 * '/api/task/{id}/remove':
 *  delete:
 *     tags:
 *     - Task
 *     summary: Remove a task
 *     security:
 *      - Authorization: []
 *     parameters:
 *      - name: id
 *        in: path
 *        description: The id of the task
 *        required: true
 *     responses:
 *      200:
 *        description: Remove task successfully
 *      400:
 *        description: Bad Request
 *      500:
 *        description: Server error
 */
router.delete('/task/:id/remove', tasksValidator.removeTask, taskController.removeTask);

module.exports = router;