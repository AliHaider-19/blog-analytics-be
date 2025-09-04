// src/models/Comment.js
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: [true, "Blog ID is required"],
    },
    commenter: {
      type: String,
      required: [true, "Commenter name is required"],
      trim: true,
      minlength: [2, "Commenter name must be at least 2 characters long"],
      maxlength: [50, "Commenter name cannot exceed 50 characters"],
    },
    commentText: {
      type: String,
      required: [true, "Comment text is required"],
      trim: true,
      minlength: [5, "Comment must be at least 5 characters long"],
      maxlength: [500, "Comment cannot exceed 500 characters"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Index for better performance
commentSchema.index({ blogId: 1, createdAt: -1 });

module.exports = mongoose.model("Comment", commentSchema);
