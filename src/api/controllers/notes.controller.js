const express = require("express");
const router = express.Router();
const {
  notes,
  getNewNote,
  getSearchNotes,
  getSearchNotesByTitle,
  getSearchNotesByType,
  postNewNote,
} = require("../services/notes.service");

const { pageNotFound } = require("../services/users.service");

const { checkNotAuthenticated } = require("../services/authentication.service");

router.get("/", checkNotAuthenticated, notes);

router.get("/new-note", checkNotAuthenticated, getNewNote);

router.get("/search", checkNotAuthenticated, getSearchNotes);

router.post("/new-note", checkNotAuthenticated, postNewNote);

router.get(
  "/search/by_title/:title",
  checkNotAuthenticated,
  getSearchNotesByTitle
);

router.get(
  "/search/by_type/:type",
  checkNotAuthenticated,
  getSearchNotesByType
);

router.all("*", pageNotFound);

module.exports = router;
