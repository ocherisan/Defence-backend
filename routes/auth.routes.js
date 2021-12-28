const { Router } = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("../config/default.json");

const router = Router();
//TODO: переделать с помощью passport.js
// /api/auth/register
router.post(
  "/register",
  [
    check("email", "Incorrect email").isEmail(),
    check("password", "Minimal password length - 6 symbols").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrect data during registration",
        });
      }

      const { email, password } = req.body;

      const candidate = await User.findOne({ email });
      if (candidate) {
        return res
          .status(400)
          .json({ message: "User with this email already exists" });
      }
      const hashedPasssword = await bcrypt.hash(password, 12);
      const newUser = new User({ email, password: hashedPasssword });

      await newUser.save();

      res.status(201).json({ message: "User is created" });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Something went wrong. Try again" });
    }
  }
);

router.post(
  "/login",
  [
    check("email", "Enter correct email").normalizeEmail().isEmail(),
    check("password", "Enter password").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrect data during registration",
        });
      }

      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User does not exist" });
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        return res
          .status(400)
          .json({ message: "Wrong cridentials. Try again" });
      }

      const token = jwt.sign(
        {
          userId: user.id,
        },
        config.get("jwtSecret"),
        {
          expiresIn: "1h",
        }
      );

      res.json({ token, userId: user.id });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong. Try again" });
    }
  }
);

module.exports = router;
