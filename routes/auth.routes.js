const express = require('express');

const router = express.Router();
const authValidator = require('../validators/auth.validator');
const authController = require('../controllers/auth.controller');

const verifySignUp = require('../middlewares/verifySignUp');

//Signup
/**
 * @openapi
 * '/api/auth/signup':
 *  post:
 *     tags:
 *     - Auth
 *     summary: Sign up
 *     requestBody:
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  required:
 *                      - fullname
 *                      - username
 *                      - password
 *                      - email
 *                      - age
 *                      - gender
 *                      - phone
 *                      - address
 *                  properties:
 *                     fullname:
 *                          type: string
 *                     username:
 *                          type: string
 *                     password:
 *                          type: string    
 *                     email:
 *                          type: string
 *                     age: 
 *                          type: number
 *                          default: 18
 *                     gender:
 *                          type: number
 *                          default: 1
 *                     phone:
 *                          type: string
 *                     address:
 *                          type: string 
 *     responses:
 *       200:
 *         description: Sign up successfully
 *       422:
 *         description: Validation fields
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/auth/signup', authValidator.validateSignUp , verifySignUp ,authController.signup);
//Login
/**
 * @openapi
 * '/api/auth/login':
 *  post:
 *     tags:
 *     - Auth
 *     summary: Log in
 *     requestBody:
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  required:
 *                      - username
 *                      - password
 *                  properties:
 *                     username:
 *                          type: string
 *                     password:
 *                          type: string
 *     responses:
 *       200:
 *         description: Log in successfully
 *       422:
 *         description: Validation fields
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/auth/login', authValidator.validateLogin, authController.login);
//Logout
/**
 * @openapi
 * '/api/auth/logout':
 *  get:
 *     tags:
 *     - Auth
 *     summary: Log out
 *     responses:
 *       200:
 *         description: Log out successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.get('/auth/logout', authController.logout);
//Renew access token
/**
 * @openapi
 * '/api/auth/renew_token':
 *  post:
 *     tags:
 *     - Auth
 *     summary: Renew token
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              refreshToken:
 *                type: string
 *     responses:
 *       200:
 *         description: Renew token successfully
 *       400:
 *         description: Bad request
 *       422:
 *         description: Validation field
 *       500:
 *         description: Server error
 */
router.post('/auth/renew_token', authValidator.renewToken, authController.renewToken);

module.exports = router;