const bcrypt = require("bcrypt");
const passport = require("passport");
const pool = require("../../../db");
const { findUserByEmail, insertUserToDB } = require("../models/users.model");

const homeRoute = function (req, res) {
  res.send("Home");
};

const usersDashboard = function (req, res) {
  // res.render("dashboard.ejs", { user: req.user.name });
  res.send(
    `Hi ${req.user.name.charAt(0).toUpperCase() + req.user.name.slice(1)}`
  );
};

const getUsersLogin = function (req, res) {
  // res.render("login.ejs");
  res.send("login with post on Postman please");
};

const getUsersRegister = function (req, res) {
  //res.render("register.ejs");
  res.send("register with post on Postman please");
};

const usersLogout = function (req, res) {
  req.logOut((err) => {
    if (err) {
      throw err;
    }
    // req.flash("success_msg", "You have logged out");
    // res.redirect("/users/login");
    return res.status(200).json({
      msg: "Successfully logged out",
      code: 200,
    });
  });
};

const validateRegistrationDetails = function (
  name,
  email,
  password,
  password2
) {
  if (!name || !email || !password || !password2) {
    return { msg: "Please enter all fields", code: 400 };
  }

  if (password.length < 6) {
    return { msg: "Password should be at least 6 characters", code: 400 };
  }

  if (password != password2) {
    return { msg: "Passwords do not match", code: 400 };
  }
  return { msg: "all good", code: 200 };
};

const checkEmailIsntRegisteredAlready = async function (email) {
  const [user] = await findUserByEmail(email);
  // console.log(user);
  if (user) {
    return 400;
  }
  return 200;
};

const postUsersRegister = async function (req, res) {
  try {
    let { name, email, password, password2 } = req.body;
    const { msg, code } = validateRegistrationDetails(
      name,
      email,
      password,
      password2
    );
    if (code != 200) {
      return res.status(code).json({
        msg,
        code,
      });
    }
    const code2 = await checkEmailIsntRegisteredAlready(email);
    // console.log(code2);
    if (code2 != 200) {
      return res.status(code2).json({
        msg: "Email is already registered",
        code: code2,
      });
    }
    let hashedPassword = await bcrypt.hash(password, 10);
    // console.log(hashedPassword);
    const [results] = await insertUserToDB(name, email, hashedPassword);
    // console.log(results);
    return res.status(200).json({
      msg: "Successfully registered",
      code: 200,
    });
  } catch (err) {
    throw err;
  }
};

const postUsersLogin = function () {
  return passport.authenticate("local", {
    successRedirect: "/users/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  });
};

const pageNotFound = function (req, res) {
  try {
    res.status(404).json({
      msg: "No route matches your request",
      code: 404,
    });
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getUsersLogin,
  getUsersRegister,
  postUsersLogin,
  postUsersRegister,
  homeRoute,
  usersDashboard,
  usersLogout,
  pageNotFound,
};
