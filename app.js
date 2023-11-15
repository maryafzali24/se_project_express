const express = require("express");
const helmet = require("helmet");

const mongoose = require("mongoose");

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

app.use((req, res, next) => {
  req.user = {
    _id: "654d06e8685f02f675cdcb7e",
  };
  next();
});
app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
  // if everything works fine, the console will show which port the application is listening to
});
