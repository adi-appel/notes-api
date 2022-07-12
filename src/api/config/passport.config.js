const localStrategy = require("passport-local").Strategy;
const pool = require("../../../db");
const bcrypt = require("bcrypt");
const { findUserByEmail, findUserById } = require("../models/users.model");

async function authenticateUser(email, password, done) {
  try {
    const [user] = await findUserByEmail(email);
    // console.log(user);
    if (!user) {
      return done(null, false, { message: "Email is not registered" });
    }
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        throw err;
      }
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password is incorrect" });
      }
    });
  } catch (err) {
    throw err;
  }
}

async function initialize(passport) {
  passport.use(
    new localStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      authenticateUser
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser(async (id, done) => {
    try {
      const [user] = await findUserById(id);
      return done(null, user);
    } catch (err) {
      throw err;
    }
  });
}

module.exports = initialize;
