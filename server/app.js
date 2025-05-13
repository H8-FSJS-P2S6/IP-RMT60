if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const router = require("./routes/index");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", router);

router.use(errorHandler);

module.exports = app;
