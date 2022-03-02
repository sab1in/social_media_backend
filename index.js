const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

//secuirty pacakages
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const error = require("./utils/error");
const swagger = require("./swagger.json");
const bodyParser = require("body-parser");

const app = express();

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to db"))
  .catch((err) => console.log("error connecting to db", err));

const swaggerOptions = {
  swaggerDefinition: swagger,
  apis: ["router/*"],
};

const limiter = (requests, time, message) =>
  rateLimit({
    max: requests,
    windowMs: time,
    message: "Too many requests from this IP",
  });

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// app.use(express.raw({ type: "*/*", limit: 996869  }));

// app.use(express({ limit: 996869 }));
// app.use(express.json({ limit: 990000 }));
app.use(helmet());
app.use(morgan("common"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/auth/login", limiter(1, 1000));
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

module.exports = app;
