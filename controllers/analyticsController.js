// src/controllers/analyticsController.js
const Blog = require("../models/Blog");
const Comment = require("../models/Comment");

// Get authors ranked by number of posts
exports.getTopAuthors = async (req, res, next) => {
  try {
    const topAuthors = await Blog.aggregate([
      {
        $group: {
          _id: "$author",
          postCount: { $sum: 1 },
          latestPost: { $max: "$createdAt" },
        },
      },
      {
        $sort: { postCount: -1, latestPost: -1 },
      },
      {
        $limit: 10,
      },
      {
        $project: {
          _id: 0,
          author: "$_id",
          postCount: 1,
          latestPost: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: topAuthors,
    });
  } catch (error) {
    next(error);
  }
};

// Get top 5 most commented posts
exports.getMostCommentedPosts = async (req, res, next) => {
  try {
    const mostCommented = await Comment.aggregate([
      {
        $group: {
          _id: "$blogId",
          commentCount: { $sum: 1 },
        },
      },
      {
        $sort: { commentCount: -1 },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: "blogs",
          localField: "_id",
          foreignField: "_id",
          as: "blog",
        },
      },
      {
        $unwind: "$blog",
      },
      {
        $project: {
          _id: 0,
          blogId: "$_id",
          title: "$blog.title",
          author: "$blog.author",
          createdAt: "$blog.createdAt",
          commentCount: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: mostCommented,
    });
  } catch (error) {
    next(error);
  }
};

// Get number of posts created per day for the last 7 days
exports.getPostsPerDay = async (req, res, next) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const postsPerDay = await Blog.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          count: 1,
        },
      },
    ]);

    // Fill in missing days with 0 count
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const found = postsPerDay.find((p) => p.date === dateStr);
      result.push({
        date: dateStr,
        count: found ? found.count : 0,
        dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get comprehensive dashboard stats
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [totalBlogs, totalComments, totalAuthors, recentBlogs] =
      await Promise.all([
        Blog.countDocuments(),
        Comment.countDocuments(),
        Blog.distinct("author").then((authors) => authors.length),
        Blog.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .select("title author createdAt"),
      ]);

    // Calculate engagement rate
    const engagementRate =
      totalBlogs > 0 ? ((totalComments / totalBlogs) * 100).toFixed(2) : 0;

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalBlogs,
          totalComments,
          totalAuthors,
          engagementRate: parseFloat(engagementRate),
        },
        recentBlogs,
      },
    });
  } catch (error) {
    next(error);
  }
};
