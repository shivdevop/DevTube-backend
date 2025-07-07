class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message);  // Call the parent Error class

        this.statusCode = statusCode; // HTTP status code (like 404, 500)
        this.data = null;             // Can be used to send additional data if needed
        this.message = message;       // Custom error message
        this.success = false;         // Always false for errors
        this.errors = errors;         // Can be used to send validation errors, etc.

        if (stack) {
            this.stack = stack;       // If custom stack trace is passed
        } else {
            Error.captureStackTrace(this, this.constructor); // Generates stack trace
        }
    }
}

export { ApiError };
