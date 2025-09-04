const authRoutes = require("./auth.routes");
const blogRoutes = require("./blog.routes");
const commentRoutes = require("./comments.routes");
const analyticsRoutes = require("./analytics.routes");

const express = require("express");
const router = express.Router();
router.use("/auth", authRoutes);
router.use("/blogs", blogRoutes);
router.use("/comments", commentRoutes);
router.use("/analytics", analyticsRoutes);

module.exports = router;
