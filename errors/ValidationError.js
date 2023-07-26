class ValidationError extends Error {
    constructor(message) {
        super();
        this.status = 422;
        this.message_errors = message;
    }
}

module.exports = ValidationError;