const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const cors = require("cors");

const path = require("path");

//secuirty pacakages
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const error = require("./utils/error");
const swagger = require("./swagger.json");

const app = express();

dotenv.config();

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

mongoose
  .connect(process.env.MONGO, {
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

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/auth/login", limiter(10, 1000));
app.use("/auth", require("./routes/auth"));
app.use("/user", require("./routes/user"));
app.use("/post", require("./routes/post"));

app.get("/uploads/:id", async (req, res, next) => {
  res.sendFile(path.join(__dirname, "uploads") + "\\" + req.params.id);
});

app.use(error);

process.on("unhandledRejection", () => {
  console.log("error unhandled");
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server started on port 5000");
});

module.exports = app;
