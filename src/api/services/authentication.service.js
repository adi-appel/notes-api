function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    // return res.redirect("/users/dashboard");
    return res.status(200).json({
      msg: "Authorized, no need to register or login again",
      code: 200,
    });
  }
  return next();
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  // return res.redirect("/users/login");
  return res
    .status(401)
    .json({ msg: "Not authorized, please register or login", code: 401 });
}

module.exports = { checkAuthenticated, checkNotAuthenticated };
