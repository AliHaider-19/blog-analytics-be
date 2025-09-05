// validation/blogValidation.js
const Joi = require("joi");

const createBlogSchema = Joi.object({
  title: Joi.string().min(5).max(200).required(),
  content: Joi.string().min(20).required(),
  author: Joi.string().min(2).max(20).required(),
  tags: Joi.array().items(Joi.string().min(1).max(30)).max(10).optional(),
  category: Joi.string().min(2).max(20).optional(),
  isPublished: Joi.boolean().default(true).optional(),
});

const updateBlogSchema = Joi.object({
  title: Joi.string().min(5).max(200).optional(),
  content: Joi.string().min(10).optional(),
  author: Joi.string().min(2).max(20).optional(),
  tags: Joi.array().items(Joi.string().min(1).max(30)).max(10).optional(),
  category: Joi.string().min(2).max(20).optional(),
  isPublished: Joi.boolean().optional(),
});

const getBlogQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().allow("").optional(),
  category: Joi.string().allow("").optional(),
  author: Joi.string().allow("").optional(),
  sortBy: Joi.string()
    .valid("createdAt", "title", "updatedAt")
    .default("createdAt"),
  sortOrder: Joi.string().valid("asc", "desc").default("desc"),
});
const blogIdSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

module.exports = {
  createBlogSchema,
  updateBlogSchema,
  getBlogQuerySchema,
  blogIdSchema,
};
