const enviromentVariables = require('../configs/envVariablesConfig');

const ErrorHandler = (err, req, res, next) => {
    const errStatus = err.status || 500;
    const errMsg = err.message_errors || err.message || 'Something went wrong';

    switch(errStatus) {
        case 401: case 404: case 409: {
            res.status(errStatus).send({
                status: false,
                statusCode: errStatus,
                message: errMsg,
            });
        }
        case 422: {
            res.status(errStatus).send({
                status: false,
                statusCode: errStatus,
                errors: errMsg,
            });
        }
        case 500: {
            res.status(errStatus).send({
                status: false,
                statusCode: errStatus,
                message: errMsg,
                stack: enviromentVariables.server_enviroment === 'development' ? err.stack : {}
            });
        }
    }
}

module.exports = ErrorHandler;