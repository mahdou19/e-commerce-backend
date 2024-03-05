const bcrypt = require("bcrypt");

const saltRounds = 10;

const hashPassword = function (password) {
  return bcrypt.hash(password, saltRounds);
};

const comparePassword = function (password, currentPassword) {
  return bcrypt.compare(password, currentPassword);
};

module.exports = {
  hashPassword,
  comparePassword,
};
