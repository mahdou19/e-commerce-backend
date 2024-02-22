const jwt = require("jsonwebtoken");
const User = require("../models/User");

const secret = process.env.SECRET_KEY;

exports.isAuth = async (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];

    try {
      const decode = jwt.verify(token, secret);
      const user = await User.findById(decode.id);
      if (!user) {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized access!" });
      }
      req.user = user;
      next();
    } catch (err) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access!",
        error: err.message,
      });
    }
  } else {
    return res
      .status(403)
      .json({ success: false, message: "Unauthorized access!" });
  }
};
