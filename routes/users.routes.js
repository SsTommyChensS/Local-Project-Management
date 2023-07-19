const express = require('express');
const router = express.Router();

const userController = require('../controllers/users.controller');
const usersValidator = require('../validators/users.validator');

//Middlewares
const checkAuth = require('../middlewares/checkAuth');

router.use(checkAuth);

//Get your profile
/**
 * @openapi
 * '/api/user/your-profile/get':
 *  get:
 *     tags:
 *     - User
 *     summary: Get your profile's information
 *     security:
 *      - Authorization: []
 *     responses:
 *       200:
 *         description: Get your profile's information successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.get('/user/your-profile/get', userController.getYourProfile);
//Get user's profile
/**
 * @openapi
 * '/api/user/profile/{id}/get':
 *  get:
 *     tags:
 *     - User
 *     summary: Get user profile's infroamation
 *     security:
 *      - Authorization: []
 *     parameters:
 *      - name: id
 *        in: path
 *        description: The id of an user
 *        required: true
 *     responses:
 *       200:
 *         description: Get user profile's information successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.get('/user/profile/:id/get', userController.getUserProfile);
//Update user's information
/**
 * @openapi
 * '/api/user/profile/{id}/update':
 *  put:
 *     tags:
 *     - User
 *     summary: Update user profile's information
 *     security:
 *      - Authorization: []
 *     parameters:
 *      - name: id
 *        in: path
 *        description: The id of the user
 *        required: true
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              fullname:
 *                type: string
 *              username:
 *                type: string
 *              age:
 *                type: number
 *                default: 18
 *              gender:
 *                type: number
 *                default: 1
 *              phone:
 *                type: string
 *              address: 
 *                type: string
 *     responses:
 *      200:
 *        description: Update user profile's information successfully
 *      400:
 *        description: Bad Request
 *      422: 
 *        description: Validation fields
 *      500:
 *        description: Server error
 */
router.put('/user/profile/:id/update', usersValidator.validateUpdateUser, userController.updateUser);
//Upload user's avatar
/**
 * @openapi
 * '/api/user/upload-avatar':
 *  post:
 *     tags:
 *     - User
 *     summary: Upload user's avatar
 *     security:
 *      - Authorization: []
 *     requestBody:
 *      content:
 *       multipart/form-data:
 *          schema:
 *              type: object
 *              properties:
 *                  avatar:
 *                      type: string
 *                      format: binary
 *                      nullable: false
 *     responses:
 *      200:
 *        description: Upload user's avatar successfully
 *      400:
 *        description: Bad Request
 *      500:
 *        description: Server error
 */
router.post('/user/upload-avatar', userController.uploadAvatar);

module.exports = router;