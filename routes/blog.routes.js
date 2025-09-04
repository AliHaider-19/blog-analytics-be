const express = require("express");
const blogController = require("../controllers/blogController");
const auth = require("../middleware/auth");
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

router.put(
  "/:id",
  auth,
  validate(updateBlogSchema, "body"),
  validate(blogIdSchema, "params"),
  blogController.updateBlog
);

router.delete(
  "/:id",
  auth,
  validate(blogIdSchema, "params"),
  blogController.deleteBlog
);

module.exports = router;
