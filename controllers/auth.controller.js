const enviromentVariables = require('../configs/envVariablesConfig');

const bcryptjs = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const User = require('../models/users.model');

//Signup
const signup = async (req, res) => {
    let { fullname, username, password, email, age, gender, phone, address } = req.body;
    //Hash password
    password = bcryptjs.hashSync(password, 10);
    //Generate randome user's code
    let code = crypto.randomBytes(4).toString('hex');
    
    try {
        const user = new User({
            fullname: fullname,
            username: username,
            password: password,
            email: email,
            age: age,
            gender: gender,
            phone: phone,
            address: address,
            code: code,
        })

        await user.save();

        res.status(200).send({
            status: 'success',
            message: 'User has been signed up successfully!'
        });

    } catch (error) {
        res.status(500).send({
            status: 'failed',
            message: 'Server error!'
        });

        console.log(error);
    }
}

//Login 
const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        //Check username
        const user = await User.findOne({ username: username });
        if(!user) {
            return res.status(400).send({
                status: 'Failed',
                message: `Cannot find this username: ${username}!`
            });
        }

        //Check user had already logged in
        const jwt_refresh = req.cookies.jwt;
        if(jwt_refresh && user.accessToken != '' && user.refreshToken != '') {
            return res.status(400).send({
                status: 'Failed',
                message: 'User has already logged in!',
            });
        }

        //Check password
        if(!bcryptjs.compareSync(password, user.password)) {
            return res.status(400).send({
                status: 'Failed',
                message: 'Invalid password!'
            });
        }

        const payload = {
            id: user._id,
            username: user.username,
            email: user.email,
        };

        //Create access token
        const accessToken = jwt.sign(payload, enviromentVariables.auth.access_token_secret, {
            expiresIn: '1h' //1 hour
        })

        //Create refresh accessToken
        const refreshToken = jwt.sign(payload, enviromentVariables.auth.refresh_token_secret, {
            expiresIn: '1d' //1 day
        })

        //Put refresh token at cookie
        res.cookie('jwt', refreshToken, {
            maxAge: 24 * 60 * 60 * 1000,
            secure: false,
            httpOnly: true,
        });

        //Update refreshToken value at DB
        await User.findByIdAndUpdate(user._id, { 
            refreshToken: refreshToken,
            accessToken:  accessToken
        });

        res.status(200).send({
            status: 'Success',
            message: 'Login successfully!',
            data: {
                accessToken: accessToken,
                username: user.username
            }
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            status: 'Failed',
            message: 'Server error!'
        });
    }
}

//Logout
const logout = async (req, res) => {
    try {    
        const jwt_refresh = req.cookies.jwt;
        if(!jwt_refresh) {
            return res.status(400).send({
                status: 'Failed',
                message: 'Already logged out!'
            })
        }
        //Get jwt payload using jwt.verify
        let decoded = jwt.verify(jwt_refresh, enviromentVariables.auth.refresh_token_secret);
        const user_updated_refresh = await User.findByIdAndUpdate(decoded.id, {
            refreshToken: '',
            accessToken: ''
        });
        
        if(!user_updated_refresh) {
            return res.status(400).send({
                status: 'Failed',
                message: 'Invalid token!'
            });
        }
        //Clear cookie jwt
        res.clearCookie('jwt');

        res.status(200).send({
            status: 'Success',
            message: 'User has been logged out successfully!'
        });
    } catch (error) {
        res.status(500).send({
            status: 'Failed',
            message: 'Server error!'
        });
    }
}

//Renew access token by using refresh token
const renewToken = async (req, res) => {
    try {
        const refreshToken = req.body.refreshToken;
        if(!refreshToken) {
            return res.status(400).send({
                abc: req.cookies,
                status: 'Failed',
                message: 'No refresh token provided!'
            });
        }
        //Check valid refreshToken
        jwt.verify(refreshToken, enviromentVariables.auth.refresh_token_secret, async (err, decoded) => {
            if(err) {
                return res.status(400).send({
                    status: 'Failed',
                    message: err.message
                });
            }

            const filter = {
                _id: decoded.id,
                refreshToken: refreshToken
            };

            const user_checked_valid = await User.findOne(filter);
            if(!user_checked_valid) {
                return res.status(400).send({
                    status: 'Failed',
                    message: 'Invalid token provided!'
                });
            }

            //If refreshToken is valid -> create new accessToken
            const payload = {
                id: user_checked_valid._id,
                username: user_checked_valid.username,
                email: user_checked_valid.email,
            };
            //New access token
            const new_accessToken = jwt.sign(payload, enviromentVariables.auth.access_token_secret, {
                expiresIn: '1h' //1 hour
            })

            await User.findByIdAndUpdate(decoded.id, {
                accessToken: new_accessToken
            });

            res.status(200).send({
                status: 'Success',
                message: 'Renew access token successfully!',
                data: {
                    accessToken: new_accessToken
                }
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: 'Failed',
            message: 'Sever error!'
        });
    }
}

const authController = {
    signup,
    login,
    logout,
    renewToken
};

module.exports = authController;