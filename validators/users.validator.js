const { check, validationResult, checkExact } = require('express-validator');

const ValidationError = require('../errors/ValidationError');

const getUserProfile = [
    checkExact([
        check('id')
            .isMongoId().withMessage('Invalid user id value!'),
    ]),
    (req, res, next) => {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                throw new ValidationError(errors.array());
            }
    
            next();
    }
];

const validateUpdateUser = [
    checkExact([
        check('fullname')
            .optional()
            .trim()
            .escape()
            .notEmpty()
            .withMessage('Fullname is required!')
            .isString()
            .withMessage('Fullname must be a string value!')
            .isLength({ min: 6, max: 20 })
            .withMessage('Fullname must be from 6 to 20 charaters!'),
        check('username')
            .optional()
            .trim()
            .escape()
            .notEmpty()
            .withMessage('Username is required!')
            .isString()
            .withMessage('Username must be a string value!')
            .isLength({ min: 6, max: 15 })
            .withMessage('Username must be from 6 to 15 charaters!'),
        check('age')
            .optional()
            .notEmpty()
            .withMessage('Age is required!')
            .isInt()
            .withMessage('Age must be a number value!')
            .isFloat({ min: 18, max: 100 })
            .withMessage('Age must be from 18 to 100!'),
        check('gender')
            .optional()
            .notEmpty().withMessage('Gender is required!')
            .isIn([1, 2, 3]).withMessage('Invalid gender value!'),
        check('phone')
            .optional()
            .notEmpty().withMessage('Phone number is required!')
            .isInt().withMessage('Phone number must contains only number!')
            .isLength({ min: 10, max: 11}).withMessage('Invalid phone number!'),
        check('address')
            .optional()
            .notEmpty().withMessage('Address is required'),
        check('id')
            .isMongoId().withMessage('Invalid user id value!'),
        check('email')
            .optional()
            .notEmpty().withMessage('Email is required!'),
        check('code')
            .optional()
            .notEmpty().withMessage('User code is required!')
    ]),
    (req, res, next) => {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                throw new ValidationError(errors.array());
            }
    
            next();
    }
];

const usersValidator = {
    getUserProfile,
    validateUpdateUser
};

module.exports = usersValidator;