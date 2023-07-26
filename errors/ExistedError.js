class ExistedError extends Error {
    constructor(message) {
        super(message);
        this.status = 409;
    }
}

module.exports = ExistedError;