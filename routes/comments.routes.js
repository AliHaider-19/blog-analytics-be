const express = require("express");
const router = express.Router();
const {
  addComment,
  getCommentsByBlogId,
  updateComment,
  deleteComment,
  getComment,
} = require("../controllers/commentController");

// Middleware (add your authentication middleware if needed)
const auth = require("../middleware/auth");

// Routes for comments

// POST /api/comments/blog/:blogId - Add a comment to a blog post
router.post("/blog/:blogId", auth, addComment);

// GET /api/comments/blog/:blogId - Get all comments for a blog post
router.get("/blog/:blogId", getCommentsByBlogId);

// GET /api/comments/:commentId - Get a single comment
router.get("/:commentId", getComment);

// PUT /api/comments/:commentId - Update a comment
router.put("/:commentId", auth, updateComment);

// DELETE /api/comments/:commentId - Delete a comment
router.delete("/:commentId", auth, deleteComment);

module.exports = router;
