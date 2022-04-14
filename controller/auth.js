const asyncFunction = require("../utils/asyncCatch");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("../utils/validator");

// Register controller
const register = asyncFunction(async (req, res, next) => {
  const { username, email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).send({ msg: "User already exists" });
  }
  if (
    !validator("username", username) ||
    validator("email", email) == null ||
    !validator("password", req.body.password)
  ) {
    return res.status(400).send({ msg: "Invalid input" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const newUser = new User({
    username: username,
    password: hashedPassword,
    email: email,
  });

  await newUser.save({ runValidators: false });
  const { password, ...userWithoutPassword } = newUser._doc;
  res.status(201).json(userWithoutPassword);
});

// Login controller
const login = asyncFunction(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ msg: "email & password required!" });
  } else {
    const oldUser = await User.findOne({ email: email });

    console.log(password, oldUser);

    if (!oldUser || !(await bcrypt.compare(password, oldUser.password))) {
      res.status(400).json({ message: "invalid credentials" });
    }

    const token = jwt.sign(
      { id: oldUser._id, isAdmin: oldUser.isAdmin },
      process.env.JWT_SEC,
      { expiresIn: "10d" }
    );
    res.status(200).json({
      id: oldUser._id,
      isAdmin: oldUser.isAdmin,
      token: token,
    });
  }
});
module.exports = { register, login };
