require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const { login, createUser } = require("./controllers/users");
const errorHandler = require("./middlewares/error-handler");

const { validateUserBody, validateLogin } = require("./middlewares/validation");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const { PORT = 3001 } = process.env;
const app = express();
app.use(helmet());

mongoose.set("strictQuery", true);
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
mongoose.connect(MONGODB_URI).then(
  () => {
    console.log("DB is connected");
  },
  (e) => console.log("DB ERROR", e),
);

const routes = require("./routes");

app.use(cors());

app.use(express.json());

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});
app.use(requestLogger);

app.post("/signin", validateLogin, login);

app.post("/signup", validateUserBody, createUser);

app.use(routes);

app.use(errorLogger); // enabling the error logger

app.use(errors()); // celebrate error handler

app.use(errorHandler); // centralized error handler

app.listen(PORT, () => {
  // if everything works fine, the console will show which port the application is listening to
});
