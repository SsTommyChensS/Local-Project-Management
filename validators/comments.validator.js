const { check, checkExact, validationResult } = require('express-validator');

//Comment at a project
const commentProject = [
    checkExact([
        check('id')
            .isMongoId().withMessage('Invalid project id value!'),
        check('content')
            .trim()
            .notEmpty().withMessage('Content required!')
            .isLength({ min: 3 }).withMessage('Content must be from 3 charaters!')
    ]),
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(422).send({
                status: 'Failed',
                errors: errors.array()
            });
        }

        next();
    }
]

//Update comment
const updateComment = [
    checkExact([
        check('id')
            .isMongoId().withMessage('Invalid comment id value!'),
        check('content')
            .trim()
            .notEmpty().withMessage('Content required!')
            .isLength({ min: 3 }).withMessage('Content must be from 3 charaters!')
    ]),
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(422).send({
                status: 'Failed',
                errors: errors.array()
            });
        }

        next();
    }
]

//Remove comment
const removeComment = [
    checkExact([
        check('id')
            .isMongoId().withMessage('Invalid comment id value!'),
    ]),
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(422).send({
                status: 'Failed',
                errors: errors.array()
            });
        }

        next();
    }
]


const getComments = [
    checkExact([
        check('id')
            .isMongoId().withMessage('Invalid project id value!'),
        check('page')
            .isInt({ min: 1 }).withMessage('Invalid page value!'),
    ]),
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(422).send({
                status: 'Failed',
                errors: errors.array()
            });
        }

        next();
    }
]

const commentsValidator = {
    commentProject,
    updateComment,
    getComments,
    removeComment
}

module.exports = commentsValidator;