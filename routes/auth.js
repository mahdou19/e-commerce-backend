const router = require("express").Router();
const User = require("../models/User");
const { hashPassword, comparePassword } = require("../utils/utils");
const jwt = require("jsonwebtoken");

const secret = process.env.SECRET_KEY;

router.post("/register", async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  if (!email || !password || !username || !confirmPassword)
    return res.status(400).json({
      message: "email, username, password, confirmPassword is required !",
    });

  const hashedPassword = await hashPassword(password);
  const findUser = await User.findOne({ email });
  if (findUser)
    return res.status(400).json({
      message: "Email user already exist ! ",
    });

  const match = await comparePassword(confirmPassword, hashedPassword);
  if (!match)
    return res.status(400).json({
      message: "Password not match ! ",
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
  const { email, password, tokens } = req.body;

  if (!email || !password)
    return res.status(400).json({
      message: "email and password is required ! ",
    });

  const findUser = await User.findOne({ email });

  if (!findUser)
    return res.status(400).json({ message: "User doesn't exist !" });

  const passwordMatch = await comparePassword(password, findUser.password);

  if (!passwordMatch)
    return res.status(400).json({
      message: "Password not match ! ",
    });

  const token = jwt.sign({ id: findUser._id }, secret, {
    expiresIn: "8h",
  });

  res.status(201).json({
    message: "user logged",
    data: {
      userId: findUser._id,
      username: findUser.username,
      token,
    },
  });
});

router.get("/loggout", async (req, res) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Authorization fail!" });
    }

    return res.json({ success: true, message: "Sign out successfully!" });
  } else {
    res.json({ success: false, message: "not token" });
  }
});

module.exports = router;
