const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes");
const categoryRoutes = require("./categoryRoutes");
const lectureRoutes = require("./lectureRoutes");
const cartRoutes = require("./cartRoutes");

router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/lectures", lectureRoutes);
router.use("/carts", cartRoutes);

module.exports = router;