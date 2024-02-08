const router = require("express").Router();
const bcrypt = require(bcrypt);

router.post("/register", (req, res) => {
  const { userName, email, password } = req.body;

  console.log(
    "username : ",
    userName,
    "email : ",
    email,
    "password : ",
    password
  );

  res.send("Hello api !");
});

module.exports = router;
