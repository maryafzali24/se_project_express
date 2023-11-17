const express = require("express");
require("dotenv").config();
const helmet = require("helmet");
const mongoose = require("mongoose");
const cors = require("cors");
const auth = require("./middleware/auth");
const { login, createUser } = require("./controllers/users");

const { PORT = 3001 } = process.env;
const app = express();
app.use(helmet());

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");
// mongoose.connect(
//   "mongodb://127.0.0.1:27017/wtwr_db",
//   (r) => {
//     console.log("connected to DB", r);
//   },
//   (e) => console.log("DB error", e),
// );
const routes = require("./routes");

app.post("/signin", login);
app.post("/signup", createUser);
// authorization
app.use(auth);
app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
  // if everything works fine, the console will show which port the application is listening to
});
