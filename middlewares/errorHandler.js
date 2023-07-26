const enviroment_variables = require('../configs/envVariablesConfig');

const ErrorHandler = (err, req, res, next) => {
    const errStatus = err.status || 500;
    const errMsg = err.message || 'Something went wrong';
    res.status(errStatus).send({
        status: false,
        statusCode: errStatus,
        message: errMsg,
    })
}

module.exports = ErrorHandler;