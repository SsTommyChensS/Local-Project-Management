const User = require('../models/users.model');

const verifySignUp = async (req, res, next) => {
    //Check username
    const username_checkExisted = await User.findOne({ username: req.body.username });

    if(username_checkExisted) {
        return res.status(400).send({
            status: 'Failed',
            message: 'This username has already been registered!'
        });
    }
    //Check email
    const email_checkExisted = await User.findOne({ email: req.body.email });
    if(email_checkExisted) {
        return res.status(400).send({
            status: 'Failed',
            message: 'This email has already been registered!'
        });
    }

    next();
};

module.exports = verifySignUp;