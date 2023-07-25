const { check, checkExact, validationResult } = require('express-validator');

const getMyProjects = [
    checkExact([
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
];

const getMySharedProjects = [
    checkExact([
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
];

const validateAddProject = [
    checkExact([
        check('title')
            .trim()
            .notEmpty().withMessage('Title is required!')
            .isLength({ min: 6 }).withMessage('Title must be from 6 charaters!'),
        check('description')
            .trim()
            .notEmpty().withMessage('Description is required!')
            .isLength({ min: 6}).withMessage('Description must be from 6 charaters!'),
        check('content')
            .trim()
            .notEmpty().withMessage('Content is required!')
            .isLength({ min: 10}).withMessage('Content must be from 10 charaters!'),
        check('status')
            .optional()
            .notEmpty().withMessage('Status is required!')
            .isIn([1, 2, 3, 4]).withMessage('Invalid status value!'),
        check('progress')
            .notEmpty().withMessage('Progress is required')
            .isInt({ min: 0, max: 100 }).withMessage('Progress must be from 0 to 100!'),
        check('start_date')
            .notEmpty().withMessage('Start date is required!')
            .isDate().withMessage('Invalid start date!'),
        check('end_date')
            .notEmpty().withMessage('End date is required!')
            .isDate().withMessage('Invalid end date!'),    
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
];

const validateUpdateProject = [
    checkExact([
        check('id')
            .isMongoId().withMessage('Invalid project id value!'),
        check('title')
            .optional()
            .trim()
            .notEmpty().withMessage('Title is required!')
            .isLength({ min: 6 }).withMessage('Title must be from 6 charaters!'),
        check('description')
            .optional()
            .trim()
            .notEmpty().withMessage('Description is required!')
            .isLength({ min: 6}).withMessage('Description must be from 6 charaters!'),
        check('content')
            .optional()
            .trim()
            .notEmpty().withMessage('Content is required!')
            .isLength({ min: 10}).withMessage('Content must be from 10 charaters!'),
        check('image')
            .optional()
            .trim()
            .isURL().withMessage('Invalid image URL'),
        check('status')
            .optional()
            .notEmpty().withMessage('Status is required!')
            .isIn([1, 2, 3, 4]).withMessage('Invalid status value!'),
        check('progress')
            .optional()
            .notEmpty().withMessage('Progress is required')
            .isInt({ min: 0, max: 100 }).withMessage('Progress must be from 0 to 100!'),
        check('start_date')
            .optional()
            .notEmpty().withMessage('Start date is required!')
            .isDate().withMessage('Invalid start date!'),
        check('end_date')
            .optional()
            .notEmpty().withMessage('End date is required!')
            .isDate().withMessage('Invalid end date!'),    
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
];

const inviteUserToProject = [
    checkExact([
        check('id')
            .isMongoId().withMessage('Invalid project id value!'),
        check('user_code')
            .trim()
            .notEmpty().withMessage('User code is required!'),
        check('permission')
            .notEmpty().withMessage('User permission is required!')
            .isIn([1, 2, 3]).withMessage('Invalid permission value!')
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

const changeMemberPermission = [
    checkExact([
        check('id')
            .isMongoId().withMessage('Invalid project id value!'),
        check('user_id')
            .trim()
            .notEmpty().withMessage('User id is required!')
            .isMongoId().withMessage('Invalid member id value!'),,
        check('permission')
            .notEmpty().withMessage('User permission is required!')
            .isIn([1, 2, 3]).withMessage('Invalid permission value!')
    ]),
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(422).send({
                status: 'Failed',
                errors: errors.array()
            })
        }

        next();
    }
]

const removeMember = [
    checkExact([
        check('id')
            .isMongoId().withMessage('Invalid project id value!'),
        check('user_id')
            .trim()
            .notEmpty().withMessage('Member id is required!')
            .isMongoId().withMessage('Invalid member id value!'),
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

//Get my projects by status
const getMyProjectsByStatus = [
    checkExact([
        check('status')
            .notEmpty().withMessage('No status provided!')
            .isIn([1, 2, 3, 4]).withMessage('Invalid status value!'),
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

//Get my shared projects by status
const getMySharedProjectsByStatus = [
    checkExact([
        check('status')
            .notEmpty().withMessage('No status provided!')
            .isIn([1, 2, 3, 4]).withMessage('Invalid status value!'),
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

//Get my projects by title
const getMyProjectsByTitle = [
    checkExact([
        check('title')
            .trim()
            .notEmpty().withMessage('No title provided!'),
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

//Get my shared projects by title
const getMySharedProjectsByTitle = [
    checkExact([
        check('title')
            .trim()
            .notEmpty().withMessage('No title provided!'),
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

const getMembers = [
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

const removeProject = [
    checkExact([
        check('id')
            .isMongoId().withMessage('Invalid project id value!'),
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

const projectsValidator = {
    getMyProjects,
    getMySharedProjects,
    validateAddProject,
    validateUpdateProject,
    inviteUserToProject,
    changeMemberPermission,
    removeMember,
    getMembers,
    getMyProjectsByStatus,
    getMyProjectsByTitle,
    getMySharedProjectsByStatus,
    getMySharedProjectsByTitle,
    removeProject
};

module.exports = projectsValidator;