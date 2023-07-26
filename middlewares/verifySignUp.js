const userService = require('../services/users.service');

const verifySignUp = async (req, res, next) => {
    try {
        //Check username
        const username_checkExisted = await userService.getUserByCondition({ username: req.body.username });
    
        if(username_checkExisted) {
            return res.status(400).send({
                status: 'Failed',
                message: 'This username has already been registered!'
            });
        }
        //Check email
        const email_checkExisted = await userService.getUserByCondition({ email: req.body.email });
        if(email_checkExisted) {
            return res.status(400).send({
                status: 'Failed',
                message: 'This email has already been registered!'
            });
        }
    
        next();   
    } catch (error) {
        next(error);
    }
};

module.exports = verifySignUp;