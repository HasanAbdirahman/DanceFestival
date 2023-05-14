const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const crypto = require("crypto");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [6, "Password must be longer than 6 characters"],
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    validate: [validator.isEmail, "Please enter a valid email"],
    unique: true,
    required: [true, "Please enter your email address"],
  },
  resetPassword: String,
  resetExpired: String,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.getJwtToken = function () {
  return jwt.sign(
    { id: this._id, expiredIn: process.env.EXPIRES_IN },
    process.env.SECRET
  );
};

userSchema.methods.getPasswordToken = async function () {
  const token = await crypto.randomBytes(20).toString("hex");
  // hash the token
  this.resetPassword = crypto.createHash("sha256").update(token).digest("hex");
  // expired token time => expiring in 30 minutes changed to milliseconds
  this.resetExpired = Date.now() * 30 * 60 * 1000;

  return token;
};

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
