const { check, checkExact, validationResult } = require('express-validator');

const getAttachments = [
    checkExact([
        check('id')
            .notEmpty().withMessage('Project id required!'),
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

const attachmentsValidator = {
    getAttachments
};

module.exports = attachmentsValidator;