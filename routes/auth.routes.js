const express = require("express");
const router = express.Router();
const {
  login,
  register,
  getProfile,
} = require("../controllers/authController");
const validate = require("../middleware/validate");
const auth = require("../middleware/auth");
const { loginSchema, registerSchema } = require("../validation/authValidation");

// POST /api/auth/login
router.post("/login", validate(loginSchema), login);

// POST /api/auth/register
router.post("/register", validate(registerSchema), register);

// GET /api/auth/profile
router.get("/profile", auth, getProfile);

module.exports = router;
