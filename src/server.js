require("dotenv/config");
require("express-async-errors");
const cors = require("cors");
const routes = require("./routes");
const express = require("express");
const uploadConfig = require("./configs/upload");

const AppError = require("./utils/AppError");

// const customError = require("./middlewares/customError");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

app.use(routes);

// app.use(customError);

app.use((error, request, response, next) => {
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
  });
});

const PORT = 3355;
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));
