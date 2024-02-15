const router = require("express").Router();
const User = require("../models/User");
const { hashPassword, comparePassword } = require("../utils/utils");
const jwt = require("jsonwebtoken");

const secret = process.env.SECRET_KEY;

router.post("/register", async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  const hashedPassword = await hashPassword(password);
  const findUser = await User.findOne({ email });
  if (findUser)
    return res.status(400).json({
      error: "Email user already exist ! ",
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
    console.log(saveUser);
    res.status(201).json({
      message: "user create successfulled",
      data: { id: saveUser._id, username, email },
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const findUser = await User.findOne({ email });

  if (!findUser)
    return res.status(400).json({ message: "User doesn't exist !" });

  const passwordMatch = await comparePassword(password, findUser.password);

  if (!passwordMatch)
    return res.status(400).json({
      error: "Password not match ! ",
    });

  const token = jwt.sign({ id: findUser._id }, secret, {
    expiresIn: "3h",
  });

  res.status(201).json({
    message: "user ",
    data: {
      userId: findUser._id,
      username: findUser.username,
      token,
    },
  });
});

module.exports = router;
