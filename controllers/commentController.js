const Comment = require("../models/Comment");
const Blog = require("../models/Blog");

// Add a comment to a blog post
const addComment = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { commentText, commenter } = req.body;

    // Validate required fields
    if (!commentText || !commenter) {
      return res.status(400).json({
        success: false,
        message: "Comment text and commenter name are required",
      });
    }

    // Check if the blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    // Create the comment
    const comment = new Comment({
      blogId,
      commenter: commenter.trim(),
      commentText: commentText.trim(),
      userId: req.user ? req.user.id : null, // Optional: if user is authenticated
    });

    await comment.save();

    // Populate the comment with blog info if needed
    await comment.populate("blogId", "title");

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: comment,
    });
  } catch (error) {
    console.error("Add comment error:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all comments for a specific blog post
const getCommentsByBlogId = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { page = 1, limit = 10, sortOrder = "desc" } = req.query;

    // Convert to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Validate pagination
    if (pageNumber < 1 || limitNumber < 1 || limitNumber > 100) {
      return res.status(400).json({
        success: false,
        message: "Invalid pagination parameters",
      });
    }

    // Check if blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    // Build sort object
    const sort = { createdAt: sortOrder === "asc" ? 1 : -1 };
    const skip = (pageNumber - 1) * limitNumber;

    // Get comments with pagination
    const [comments, total] = await Promise.all([
      Comment.find({ blogId })
        .sort(sort)
        .skip(skip)
        .limit(limitNumber)
        .populate("userId", "username email")
        .lean(),
      Comment.countDocuments({ blogId }),
    ]);

    const totalPages = Math.ceil(total / limitNumber);

    res.json({
      success: true,
      data: {
        comments,
        pagination: {
          currentPage: pageNumber,
          totalPages,
          totalComments: total,
          hasNextPage: pageNumber < totalPages,
          hasPrevPage: pageNumber > 1,
          limit: limitNumber,
        },
      },
    });
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update a comment (only by the comment author or admin)
const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { commentText } = req.body;

    if (!commentText) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    // Find the comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check if user has permission to update (if authentication is implemented)
    // if (req.user && comment.userId && comment.userId.toString() !== req.user.id) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "You can only update your own comments",
    //   });
    // }

    // Update the comment
    comment.commentText = commentText.trim();
    comment.updatedAt = new Date();

    await comment.save();

    res.json({
      success: true,
      message: "Comment updated successfully",
      data: comment,
    });
  } catch (error) {
    console.error("Update comment error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Delete a comment (only by the comment author or admin)
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    // Find and delete the comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check if user has permission to delete (if authentication is implemented)
    // if (req.user && comment.userId && comment.userId.toString() !== req.user.id) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "You can only delete your own comments",
    //   });
    // }

    await Comment.findByIdAndDelete(commentId);

    res.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Delete comment error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get a single comment by ID
const getComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId)
      .populate("blogId", "title")
      .populate("userId", "username email");

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    res.json({
      success: true,
      data: comment,
    });
  } catch (error) {
    console.error("Get comment error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  addComment,
  getCommentsByBlogId,
  updateComment,
  deleteComment,
  getComment,
};
