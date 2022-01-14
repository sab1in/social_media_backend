const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");
const helmet = require("helmet");

const error = require("./utils/error");

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to db"))
  .catch((err) => console.log("error connecting to db", err));

const app = express();
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/auth", require("./routes/auth"));
app.use("/user", require("./routes/user"));
app.use("/post", require("./routes/post"));

app.use(error);

process.on("unhandledRejection", () => {
  console.log("error unhandled");
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server started on port 5000");
});
