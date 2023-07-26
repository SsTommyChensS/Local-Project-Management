const { check, validationResult } = require('express-validator');

const ValidationError = require('../errors/ValidationError');

// Sign up
const validateSignUp = [
    check('fullname')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Fullname is required!')
        .isString()
        .withMessage('Fullname must be a string value!')
        .isLength({ min: 6, max: 20 })
        .withMessage('Fullname must be from 6 to 20 charaters!'),
    check('username')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Username is required!')
        .isString()
        .withMessage('Username must be a string value!')
        .isLength({ min: 6, max: 15 })
        .withMessage('Username must be from 6 to 15 charaters!'),
    check('password')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Password is required!')
        .isLength({ min: 6, max: 15 })
        .withMessage('Password must be from 6 to 15 charaters!'),
    check('age')
        .notEmpty()
        .withMessage('Age is required!')
        .isInt()
        .withMessage('Age must be a number value!')
        .isFloat({ min: 18, max: 100 })
        .withMessage('Age must be from 18 to 100!'),
    check('email')
        .notEmpty().withMessage('Email is required!')
        .isEmail().withMessage('Invalid email!'),
    check('gender')
        .notEmpty().withMessage('Gender is required!')
        .isIn([1, 2, 3]).withMessage('Invalid gender value!'),
    check('phone')
        .notEmpty().withMessage('Phone number is required!')
        .isInt().withMessage('Phone number must contains only number!')
        .isLength({ min: 10, max: 11}).withMessage('Invalid phone number!'),
    check('address')
        .notEmpty().withMessage('Address is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            throw new ValidationError(errors.array());
        }

        next();
    }
];

//Login
const validateLogin = [
    check('username')
        .notEmpty().withMessage('Username is required!')
        .isString().withMessage('Username must be a string value!')
        .isLength({ min: 6, max: 15 }).withMessage('Username must be from 6 to 15 charaters!'),
    check('password')
        .notEmpty().withMessage('Password is required!')
        .isString().withMessage('Password must be a string value!')
        .isLength({ min: 6, max: 15 }).withMessage('Password must be from 6 to 15 charaters!'),
        (req, res, next) => {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                throw new ValidationError(errors.array());
            }

            next();
        }

];

const renewToken = [
    check('refreshToken')
        .notEmpty().withMessage('refreshToken is required!'),
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            throw new ValidationError(errors.array());
        }

        next();
    }
];

const authValidator = {
    validateSignUp,
    validateLogin,
    renewToken
}

module.exports = authValidator;