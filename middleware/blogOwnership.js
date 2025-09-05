// middleware/blogOwnership.js
const Blog = require("../models/Blog"); // Adjust path as needed

const checkBlogOwnership = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find the blog post
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    console.log("Blog found:", blog);
    console.log("Authenticated user ID:", req.user);

    // Check if the authenticated user is the owner
    if (blog.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to perform this action on this blog post",
      });
    }

    // Attach the blog to the request object for use in the controller
    req.blog = blog;
    next();
  } catch (error) {
    console.error("Blog ownership check error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = checkBlogOwnership;
