export const errMiddleware = (err, req, res, next) => {
    console.log('err middle ware caught');
    console.log(err);
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;
    // If Mongoose not found error, set to 404 and change message
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404;
        message = 'Resource not found';
    }
    if (err.name === 'error.nouser') {
        statusCode = 404;
        message = 'incorrect email or password';
    }
    res.status(statusCode).json({
        message: message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};
