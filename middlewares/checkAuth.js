const enviromentVariables = require('../configs/envVariablesConfig');

const jwt = require('jsonwebtoken');
const User = require('../models/users.model');

const checkAuth = (req, res, next) => {
    try {
        //Check empty header token
        if(!req.headers.authorization) {
            return res.status(400).send({
                status: 'Failed',
                message: 'No token provided!'
            });
        }

        //Check if user had been logged in (Check refreshToken in cookies)
        if(!req.cookies.jwt) {
            return res.status(400).send({
                status: 'Failed',
                message: 'User did not log in!'
            });
        }

        // Verify token 
        const token = req.headers.authorization.split(' ')[1];
        
        jwt.verify(token, enviromentVariables.auth.access_token_secret, async (err, decoded) => {
            if(err) {
                return res.status(400).send({
                    status: 'Failed',
                    message: err.message
                });
            }

            //Check old accessToken 
            const user_check_accessToken = await User.findOne({
                _id: decoded.id,
                accessToken: token
            });

            if(!user_check_accessToken) {
                return res.status(400).send({
                    status: 'Failed',
                    message: 'This is an old token, please renew a new one!'
                });
            }

            //Transfer the user's data
            req.user = decoded;
            next();
        })

    } catch (error) {
        res.status(500).send({
            status: 'Failed',
            message: 'Server error!'
        });
    }
}

module.exports = checkAuth;