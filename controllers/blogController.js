const Blog = require("../models/Blog"); // Assuming you have a Blog model

const createBlog = async (req, res) => {
  try {
    const { title, content, author, tags, category, isPublished } = req.body;

    const blog = new Blog({
      title,
      content,
      author,
      tags: tags || [],
      category: category || "General",
      isPublished: isPublished !== undefined ? isPublished : true,
      userId: req.user.id, // From authenticateToken middleware
    });

    await blog.save();

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Create blog error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      author,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    console.log(req.query, "===================");

    // Convert string parameters to appropriate types
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Validate pagination parameters
    if (pageNumber < 1 || limitNumber < 1 || limitNumber > 100) {
      return res.status(400).json({
        success: false,
        message: "Invalid pagination parameters",
      });
    }

    // Build query
    const query = {};

    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { content: { $regex: search.trim(), $options: "i" } },
      ];
    }

    if (category && category.trim()) {
      query.category = { $regex: category.trim(), $options: "i" };
    }

    if (author && author.trim()) {
      query.author = { $regex: author.trim(), $options: "i" };
    }

    // Build sort object
    const validSortFields = ["createdAt", "updatedAt", "title", "views"];
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : "createdAt";
    const finalSortOrder = sortOrder === "asc" ? 1 : -1;

    const sort = {};
    sort[finalSortBy] = finalSortOrder;

    // Execute query with pagination and population
    const skip = (pageNumber - 1) * limitNumber;

    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limitNumber)
        .populate("userId", "username email") // Populate user info
        .populate("comments", "commenter commentText createdAt userId") // Populate comments
        .populate("commentCount") // Populate comment count
        .lean({ virtuals: true }), // Include virtuals in lean query
      Blog.countDocuments(query),
    ]);

    console.log("Fetched blogs with populated comments:", blogs.length);

    const totalPages = Math.ceil(total / limitNumber);

    const responseData = {
      success: true,
      data: {
        blogs,
        pagination: {
          currentPage: pageNumber,
          totalPages,
          totalBlogs: total,
          hasNextPage: pageNumber < totalPages,
          hasPrevPage: pageNumber > 1,
          limit: limitNumber,
        },
      },
    };

    console.log(
      "Sending response with",
      responseData.data.blogs.length,
      "blogs"
    );
    res.json(responseData);
  } catch (error) {
    console.error("Get all blogs error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const getBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("Get blog error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const userId = req.user.id; // Get user ID from auth middleware

    // First, find the blog to check ownership
    const existingBlog = await Blog.findById(id);

    if (!existingBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Check if the authenticated user is the author of the blog
    // if (existingBlog.author.toString() !== userId.toString()) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "You are not authorized to update this blog post",
    //   });
    // }

    // Add updatedAt timestamp
    updateData.updatedAt = new Date();

    // Update the blog
    const blog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("author", "username name email");

    res.json({
      success: true,
      message: "Blog updated successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Update blog error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Get user ID from auth middleware

    // First, find the blog to check ownership
    const existingBlog = await Blog.findById(id);

    if (!existingBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // // Check if the authenticated user is the author of the blog
    // if (existingBlog.author.toString() !== userId.toString()) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "You are not authorized to delete this blog post",
    //   });
    // }

    // Delete the blog
    const blog = await Blog.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Delete blog error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
};
