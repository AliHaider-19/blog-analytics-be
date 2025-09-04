// Update your Blog model to include a virtual for comments (you already have commentCount)
const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
    },
    author: {
      type: String,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for comment count
blogSchema.virtual("commentCount", {
  ref: "Comment",
  localField: "_id",
  foreignField: "blogId",
  count: true,
});

// Virtual for comments array
blogSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "blogId",
  options: {
    sort: { createdAt: -1 }, // Latest comments first
    limit: 50, // Limit comments per blog to prevent huge responses
  },
});

// Create slug from title before saving
blogSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug =
      this.title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") +
      "-" +
      Date.now();
  }
  next();
});

// Index for better performance
blogSchema.index({ author: 1, createdAt: -1 });
blogSchema.index({ title: "text", content: "text" });

module.exports = mongoose.model("Blog", blogSchema);
