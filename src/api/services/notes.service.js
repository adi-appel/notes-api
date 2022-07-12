const {
  insertNewNoteToDB,
  findNoteByCreatorAndTitle,
  findNoteByCreatorAndType,
} = require("../models/notes.model");

const notes = function (req, res) {
  res.send(
    req.user.name.charAt(0).toUpperCase() +
      req.user.name.slice(1) +
      `, Welcome To Notes`
  );
};

const getNewNote = function (req, res) {
  res.send("Submit new note through post on postman");
};

const getSearchNotes = function (req, res) {
  res.send("Search notes through post on postman");
};

const postNewNote = async function (req, res) {
  try {
    let { title, type, note } = req.body;
    if (!title || !type || !note) {
      return res
        .status(400)
        .json({ msg: "please enter all fields", code: 400 });
    }
    const [results] = await insertNewNoteToDB(
      title,
      type,
      note,
      req.user.email,
      new Date()
    );
    res.status(200).json({ msg: "Successfully submitted new note", code: 200 });
  } catch (err) {
    throw err;
  }
};

const getSearchNotesByTitle = async function (req, res) {
  try {
    const results = await findNoteByCreatorAndTitle(
      req.user.email,
      req.params.title
    );
    if (results.length == 0) {
      return res.status(400).json({
        msg: "couldn't find a note with the given title",
        code: 400,
      });
    }
    return res.status(200).json({
      msg: "these are your search results: ",
      results: results,
      code: 200,
    });
  } catch (err) {
    return res.status(400).json({
      msg: err,
      code: 400,
    });
  }
};

const getSearchNotesByType = async function (req, res) {
  try {
    const results = await findNoteByCreatorAndType(
      req.user.email,
      req.params.type
    );
    if (results.length == 0) {
      return res.status(400).json({
        msg: "couldn't find a note with the given type",
        code: 400,
      });
    }
    return res.status(200).json({
      msg: "these are your search results: ",
      results: results,
      code: 200,
    });
  } catch (err) {
    return res.status(400).json({
      msg: err,
      code: 400,
    });
  }
};

module.exports = {
  notes,
  getNewNote,
  getSearchNotes,
  getSearchNotesByTitle,
  getSearchNotesByType,
  postNewNote,
};
