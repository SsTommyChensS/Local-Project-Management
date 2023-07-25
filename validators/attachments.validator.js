const { check, checkExact, validationResult } = require('express-validator');

const addAttachment = [
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

const getAttachments = [
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

const removeAttachment = [
    checkExact([
        check('id')
            .isMongoId().withMessage('Invalid attachment id value!'),
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

const attachmentsValidator = {
    addAttachment,
    getAttachments,
    removeAttachment
};

module.exports = attachmentsValidator;