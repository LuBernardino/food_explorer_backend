const AppError = require("../utils/AppError");

function customError(error, request, response, next) {
    if (error instanceof AppError) {
        return response.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
    }
    
    console.error(error);
    
    return response.status(500).json({
        status: "error",
        message: "Internal server error",
    })
}

module.exports = customError;