const express = require("express");
const router = express.Router();
const User = require("../models/index_model");
const mid = require("../middleware/index_middle");
// GET /
router.get("/", (request, response, next) => {
  return response.render("index", { title: "Trang Chur" });
});

// GET /profile
router.get("/profile", function(request, response, next) {
  // return response.render("profile");
  User.findById(request.session.userId).exec(function(error, user) {
    if (error) {
      return next(error);
    } else {
      return response.render("profile", {
        title: "Trang cá nhân",
        name: user.name
      });
    }
  });
});

// POST login
router.post("/login", function(request, response, next) {
  if (request.body.email && request.body.password) {
    User.authenticate(request.body.email, request.body.password, function(
      error,
      user
    ) {
      if (error || !user) {
        var err = new Error("Sai email - mật khẩu.");
        err.status = 401;
        return next(err);
      } else {
        request.session.userId = user._id;
        return response.redirect("/profile");
      }
    });
  } else {
    var err = new Error("Điền email + mật khẩu");
    err.status = 401;
    return next(err);
  }
});

module.exports = router;
