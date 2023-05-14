const User = require("../models/user");
const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    next(new Error("No token provided"));
  }
  const decoded = jwt.verify(token, process.env.SECRET);

  req.user = await User.findById(decoded._id);

  next();
};

//  isAuthorized => checking the roles => admin or user

const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.roles)) {
      return next(
        new Error(
          `Role (${req.user.role}) is not allowed to acccess this resource`,
          403
        )
      );
    }
    next();
  };
};

module.exports = {
  isAuthenticated,
  isAuthorized,
};
