class ApiError extends Error {
    constructor(statusCode, message) {
        super(message),
        this.statusCode = statusCode,
        this.message = message
        this.error = [],
        this.success = false
    }
}

export {ApiError};