const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../services/authentication.service");

const {
  getUsersLogin,
  getUsersRegister,
  postUsersLogin,
  postUsersRegister,
  homeRoute,
  usersDashboard,
  usersLogout,
  pageNotFound,
} = require("../services/users.service");

router.get("/", homeRoute);

router.get("/dashboard", checkNotAuthenticated, usersDashboard);

router.get("/login", checkAuthenticated, getUsersLogin);

router.get("/register", checkAuthenticated, getUsersRegister);

router.post("/logout", checkNotAuthenticated, usersLogout);

router.post("/register", checkAuthenticated, postUsersRegister);

//couldn't move it to the server layer + couldn't get to req.body parameters to login through postman
router.post(
  "/login",
  checkAuthenticated,
  passport.authenticate("local"),
  // {
  // successRedirect: "/users/dashboard",
  // failureRedirect: "/users/login",
  // }
  (req, res) => {
    res.status(200).json({ msg: "Successfully logged in", code: 200 });
  },
  (err, req, res, next) => {
    res.status(200).json({ msg: err, code: 400 });
  }
);

// (err, user, info) => {
//   if (err || !user) {
//     const err = {};
//     err.status = 400;
//     return res.json(err);
//     // res.status(401).json(info);
//   } else {
//     req.logIn(user);
//     res.status(200).json({ msg: "Successfully logged in", code: 200 });
//   }
// }
// );
// });
//   ),
//   (req, res) => {
//     res.status(200).json({ msg: "Successfully logged in", code: 200 });
//   }
// );

router.all("*", pageNotFound);

module.exports = router;
