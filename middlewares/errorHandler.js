const enviroment_variables = require('../configs/envVariablesConfig');

const ErrorHandler = (err, req, res, next) => {
    const errStatus = err.statusCode || 500;
    const errMsg = err.message || 'Something went wrong';
    res.status(errStatus).send({
        status: 'Failed',
        statusCode: errStatus,
        message: errMsg,
        stack: enviroment_variables.server_enviroment === 'development' ? err.stack : {}
    })
}

module.exports = ErrorHandler;