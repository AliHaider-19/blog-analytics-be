const express = require("express");
const router = express.Router();
const {
  login,
  register,
  getProfile,
  forgotPassword,
  resetPassword,
  changePassword,
} = require("../controllers/authController");
const validate = require("../middleware/validate");
const auth = require("../middleware/auth");
const { 
  loginSchema, 
  registerSchema, 
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema 
} = require("../validation/authValidation");

// POST /api/auth/login
router.post("/login", validate(loginSchema), login);

// POST /api/auth/register
router.post("/register", validate(registerSchema), register);

// GET /api/auth/profile
router.get("/profile", auth, getProfile);

// POST /api/auth/forgot-password
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);

// PUT /api/auth/reset-password/:resettoken
router.put("/reset-password/:resettoken", validate(resetPasswordSchema), resetPassword);

// PUT /api/auth/change-password
router.put("/change-password", auth, validate(changePasswordSchema), changePassword);

module.exports = router;
