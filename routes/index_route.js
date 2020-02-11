const express = require("express");
const router = express.Router();
const User = require("../models/index_model");
const mid = require("../middleware/index_middle");
// GET /
router.get("/", (request, response, next) => {
  return response.render("index", { title: "Trang Chur" });
});
//post profile
router.post("/profile", function(request, response) {
  User.findById(request.session.userId).exec(function(error, user) {
    if (error) {
      return next(error);
    } else {
      // console.log(request.body);
      return response.render("profile", {
        title: "Trang cá nhân",
        name: request.body.username
      });
    }
  });
});
// GET /profile
router.get("/profile", function(request, response, next) {
  User.findById(request.session.userId).exec(function(error, user) {
    if (error) {
      return next(error);
    } else {
      return response.render("profile", {
        title: "Trang cá nhân",
        name: request.body.username
      });
    }
  });
});

// POST login
router.post("/login", function(request, response, next) {
  console.log(request.body);
  if (request.body.username && request.body.password) {
    console.log("vao post login");
    User.authenticate(request.body.username, request.body.password, function(
      error,
      user
    ) {
      console.log(request);
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
    return response.redirect("/");
  }
});

//POST register
router.post("/register", (request, response, next) => {
  if (
    request.body.email &&
    request.body.password &&
    request.body.confirmPassword
  ) {
    // confirm that user typed same password twice
    if (request.body.password !== request.body.confirmPassword) {
      var err = new Error("Mật khẩu k đúng.");
      err.status = 400;
      return next(err);
    }

    // tạo đổi tượng với form input
    var userData = {
      email: request.body.email,
      password: request.body.password
    };

    // Dùng chức năng create của scheme để điền vào mongo
    User.create(userData, function(error, user) {
      if (error) {
        return next(error);
      } else {
        request.session.userId = user._id;
        return response.redirect("/profile");
      }
    });
  } else {
    var err = new Error("All fields rquired.");
    err.status = 400;
    return next(err);
  }
});

module.exports = router;
