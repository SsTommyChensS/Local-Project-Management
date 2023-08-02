const enviromentVariables = require('../configs/envVariablesConfig');

const jwt = require('jsonwebtoken');
const userService = require('../services/users.service');

const UnauthorizedError = require('../errors/UnauthorizedError');

const checkAuth = (req, res, next) => {
    try {
        //Check empty header token
        if(!req.headers.authorization) {
            throw new UnauthorizedError('No token provided!');
        }

        //Check if user had been logged in (Check refreshToken in cookies)
        if(!req.cookies.jwt) {
            throw new UnauthorizedError('User did not log in!');
        }

        // Verify token 
        const token = req.headers.authorization.split(' ')[1];
        
        jwt.verify(token, enviromentVariables.auth.access_token_secret, async (err, decoded) => {
            if(err) {
                return res.status(400).send({
                    status: false,
                    message: err.message
                })
            }

            //Check old accessToken 
            const user_check_accessToken = await userService.getUserByCondition({
                _id: decoded.id,
                accessToken: token
            });

            if(!user_check_accessToken) {
                return res.status(400).send({
                    status: false,
                    message: 'This is an old token, please renew a new one!'
                })
            }

            //Transfer the user's data
            req.user = decoded;
            next();
        })

    } catch (error) {
        next(error);
    }
}

module.exports = checkAuth;