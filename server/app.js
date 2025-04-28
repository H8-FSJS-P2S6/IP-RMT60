require('dotenv').config();
const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");

app.use(cors());
//middleware body-parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Welcome to SAR NDT SERVICES");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
