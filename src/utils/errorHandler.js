const errorHandler = (err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
}

export { errorHandler };
// This error handler middleware captures errors thrown in the app and sends a json response with error message and status code 

