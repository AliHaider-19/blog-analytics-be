// src/routes/analytics.js
const express = require("express");
const analyticsController = require("../controllers/analyticsController");

const router = express.Router();

router.get("/top-authors", analyticsController.getTopAuthors);
router.get("/most-commented", analyticsController.getMostCommentedPosts);
router.get("/posts-per-day", analyticsController.getPostsPerDay);
router.get("/dashboard-stats", analyticsController.getDashboardStats);

module.exports = router;
