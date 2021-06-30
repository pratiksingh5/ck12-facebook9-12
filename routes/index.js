const express = require("express");
const passport = require("passport");
const router = express.Router();
const userModel = require("./users");

const data = new userModel()

const localStrategy = require("passport-local");

passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get("/", function (req, res) {
  res.render("index");
});

router.post("/reg", function (req, res) {
  const dets = new userModel({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
  });

  userModel.register(dets, req.body.password).then(function (registeredUser) {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile");
    });
  });
});

router.get("/profile",isLoggedIn ,function (req, res) {
  userModel.findOne({username:req.session.passport.user})
  .then(function(user){
    res.render('profile',{user});
  })
});


router.get("/login", function (req, res) {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);

router.get("/logout", function (req, res) {
  req.logOut();
  res.redirect("/");
});



function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

module.exports = router;
