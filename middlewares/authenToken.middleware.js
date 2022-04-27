var jwt = require("jsonwebtoken");
var User = require("../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
  if (!req.cookies.token) {
    res.render("login");
    return;
  } else {
    var user_id = jwt.verify(
      req.cookies.token,
      process.env.ACCESS_TOKEN_SECRET
    ).id;
    var user = await User.findOne({ _id: user_id });
    if (user.isAdmin) {
      
      next();
    } else {
      res.render("login", {
        errors: ["Ban khong co quyen truy cap"],
      });
      return;
    }
  }
};
