const router = require("express").Router();
const User = require("../models/User");
const { hashPassword, comparePassword } = require("../utils/utils");

router.post("/register", async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  const hashedPassword = await hashPassword(password);
  const findUser = await User.findOne({ email });
  if (findUser)
    return res.status(400).json({
      error: "Email user already exit ! ",
    });

  const match = await comparePassword(confirmPassword, hashedPassword);
  if (!match)
    return res.status(400).json({
      error: "Password not match ! ",
    });

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    const saveUser = await newUser.save();
    res.status(201).json({
      message: "user create successfulled",
      data: { id: saveUser._id, username },
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
