const express = require("express");
const app = express();
const session = require("express-session");
const passport = require("passport");
const usersRouter = require("./src/api/controllers/users.controller");
const notesRouter = require("./src/api/controllers/notes.controller");

const initializePassport = require("./src/api/config/passport.config");
initializePassport(passport);

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/users", usersRouter);
app.use("/notes", notesRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
