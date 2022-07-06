const express = require("express");
const app = express();
const pool = require("./db");
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");

const initializePassport = require("./passportConfig");
const { title } = require("process");
initializePassport(passport);

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view-engine", "ejs");
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/users/dashboard", checkNotAuthenticated, (req, res) => {
  res.render("dashboard.ejs", { user: req.user.name });
});

app.get("/users/login", checkAuthenticated, (req, res) => {
  res.render("login.ejs");
});

app.get("/users/register", checkAuthenticated, (req, res) => {
  res.render("register.ejs");
});

app.get("/users/logout", (req, res) => {
  req.logOut((err) => {
    if (err) {
      throw err;
    }
    req.flash("success_msg", "You have logged out");
    res.redirect("/users/login");
  });
});

app.post("/users/register", async (req, res) => {
  let { name, email, password, password2 } = req.body;

  console.log({
    name,
    email,
    password,
    password2,
  });

  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ message: "Please enter all fields" });
  }

  if (password.length < 6) {
    errors.push({ message: "Password should be at least 6 characters" });
  }

  if (password != password2) {
    errors.push({ message: "Passwords do not match" });
  }

  if (errors.length > 0) {
    res.render("register.ejs", { errors });
  } else {
    //Form validation has passed
    let hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email],
      (err, results) => {
        if (err) {
          throw err;
        }
        console.log(results.rows);

        if (results.rows.length > 0) {
          errors.push({ message: "Email is already registered" });
          res.render("register.ejs", { errors });
        } else {
          pool.query(
            `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, password`,
            [name, email, hashedPassword],
            (err, results) => {
              if (err) {
                throw err;
              }
              console.log(results.rows);
              req.flash("success_msg", "You are now registered. Please log in");
              res.redirect("/users/login");
            }
          );
        }
      }
    );
  }
});

app.post(
  "/users/login",
  passport.authenticate("local", {
    successRedirect: "/users/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })
);

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/dashboard");
  }
  return next();
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/users/login");
}

app.get("/notes", checkNotAuthenticated, (req, res) => {
  res.render("notes.ejs", { user: req.user.name });
});

app.get("/notes/new-note", checkNotAuthenticated, (req, res) => {
  res.render("newNote.ejs");
});

app.get("/notes/search", checkNotAuthenticated, (req, res) => {
  res.render("searchNotes.ejs", { user: req.user.name });
});

app.get("/notes/search/by-title", checkNotAuthenticated, (req, res) => {
  res.render("searchNoteByTitle.ejs");
});

app.get("/notes/search/by-type", checkNotAuthenticated, (req, res) => {
  res.render("searchNoteByType.ejs");
});

app.post("/notes/new-note", async (req, res) => {
  let { title, type, note } = req.body;
  console.log({ title, type, note });
  let errors = [];
  if (!title || !type || !note) {
    errors.push({ message: "Please enter all fields" });
    res.render("newNote.ejs", { errors });
  }
  pool.query(
    `INSERT INTO notes (title, type, note, creator, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING title, creator`,
    [title, type, note, req.user.email, new Date()],
    (err, results) => {
      if (err) {
        throw err;
      }
      console.log(results.rows);
      req.flash("success_msg", "New note added to your notes");
      res.redirect("/notes/");
    }
  );
});

app.post("/notes/search", (req, res) => {
  let { byTitle, byType } = req.body;
  if (byTitle) {
    res.redirect(`/notes/search/by_title/${byTitle}`);
  } else if (byType) {
    res.redirect(`/notes/search/by_type/${byType}`);
  } else {
    console.log({ message: "Please enter one of the fields" });
  }
});

app.get("/notes/search/by_title/:title", async (req, res) => {
  try {
    // console.log(title);
    const results = await pool.query(
      "SELECT * FROM notes WHERE creator=$1 AND title=$2",
      [req.user.email, req.params.title]
    );
    res.send(results.rows);
  } catch (err) {
    console.log({ message: err });
  }
});

app.get("/notes/search/by_type/:type", async (req, res) => {
  try {
    const results = await pool.query(
      `SELECT * FROM notes WHERE creator=$1 AND type=$2`,
      [req.user.email, req.params.type]
    );
    res.send(results.rows);
  } catch (err) {
    console.log({ message: err });
  }
});

//create a note
// app.post("/notes", async (req, res) => {
//   try {
//     const { description } = req.body;
//     const newNote = await pool.query(
//       "INSERT INTO firstone (description) VALUES ($1) RETURNING *",
//       [description]
//     );
//     res.json(newNote.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//   }
// });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
