const sendToken = (user, statusCode, res) => {
  const token = user.getJwtToken();

  const options = {
    httpOnly: true,
    expire: new Date(
      Date.now() * process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, user });
};

module.exports = sendToken;
