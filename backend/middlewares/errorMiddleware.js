export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    let message = err.message || "Internal server error";

    if(Array.isArray(message)){
        message = message.map(e => e.msg);
    }
    // console.log("Error stack: ", err.stack);

    res.status(statusCode).json({
        success: false,
        message,
        stack : process.env.NODE_ENV === "production" ? null : err.stack,
    });
}