const user = require("../models/user");
const User = require("../models/user");
const sendToken = require("../utils/sendToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

const registerUser = async function (req, res, next) {
  const { email, password, name } = req.body;

  const user = await User.create({ email, password, name });

  if (!user) {
    return next(new Error("Invalid "));
  }
  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(new Error("User already exists"));
  }

  sendToken(user, 200, res);
};

// login

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new Error("Invalid email or password"));
  }

  const user = await User.findOne({ email });
  if (!user) {
    next(new Error("User not found"));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    next(new Error("Password mismatch"));
  }
  sendToken(user, 200, res);
};

// logout

const logout = function (req, res) {
  res.cookie("token", null, { expire: Date.now(), httpOnly: true });
  res.status(200).json({
    message: "Logged out successfully",
    success: true,
  });
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return next(new Error("Email not found"));

  const resetToken = await user.getPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.FRONTEND_URL}/api/v1/resetPassword/${resetToken}`;
  const message = `This is the url to reset your password ${resetUrl} and please ignore this request if you are the sender`;

  try {
    await sendEmail({
      email: user.email,
      Subject: "Dance Festival Password Reset",
      message,
    });
    res
      .status(200)
      .json({ success: true, message: `Email sent to ${user.email}` });
  } catch (error) {
    user.resetPassword = null;
    user.resetExpired = null;

    await user.save({ validateBeforeSave: false });

    return next(new Error(error.message, 500));
  }
};

const resetPassword = async function (req, res, next) {
  //  first we have to get the token and hash and then

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // comparing
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new Error("Reset token is not valid or expired"));
  }

  // password does not match the confirm password
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }
  // set up the new password
  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  // saving the user
  await user.save();

  sendToken(user, 200, res);
};

module.exports = {
  registerUser,
  login,
  logout,
  forgotPassword,
  resetPassword,
};
