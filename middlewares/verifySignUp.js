const userService = require('../services/users.service');

const ExistedError = require('../errors/ExistedError');

const verifySignUp = async (req, res, next) => {
    try {
        //Check username
        const username_checkExisted = await userService.getUserByCondition({ username: req.body.username });
    
        if(username_checkExisted) {
            throw new ExistedError('This username has already been registered!');
        }
        //Check email
        const email_checkExisted = await userService.getUserByCondition({ email: req.body.email });
        if(email_checkExisted) {
            throw new ExistedError('This email has already been registered!');
        }
    
        next();   
    } catch (error) {
        next(error);
    }
};

module.exports = verifySignUp;