const express = require("express");
const blogController = require("../controllers/blogController");
const auth = require("../middleware/auth");
const checkBlogOwnership = require("../middleware/blogOwnership.js"); // Add this
const {
  createBlogSchema,
  updateBlogSchema,
  getBlogQuerySchema,
  blogIdSchema,
} = require("../validation/blogValidation");
const validate = require("../middleware/validate");

const router = express.Router();

// Routes
router.post("/", auth, validate(createBlogSchema), blogController.createBlog);

router.get(
  "/",
  validate(getBlogQuerySchema, "query"),
  blogController.getAllBlogs
);

router.get("/:id", validate(blogIdSchema, "params"), blogController.getBlog);

// Updated routes with ownership middleware
router.put(
  "/:id",
  auth,
  // validate(blogIdSchema, "params"),
  checkBlogOwnership, // Add ownership check
  validate(updateBlogSchema, "body"),
  blogController.updateBlog
);

router.delete(
  "/:id",
  auth,
  // validate(blogIdSchema, "params"),
  checkBlogOwnership, // Add ownership check
  blogController.deleteBlog
);

module.exports = router;
