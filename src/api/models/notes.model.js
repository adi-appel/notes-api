const pool = require("../../../db");

const insertNewNoteToDB = async function (
  title,
  type,
  note,
  creator,
  created_at
) {
  try {
    const results = await pool.query(
      `INSERT INTO notes (title, type, note, creator, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING title, creator`,
      [title, type, note, creator, created_at]
    );
    return results.rows;
  } catch (err) {
    throw err;
  }
};

const findNoteByCreatorAndTitle = async function (creator, title) {
  try {
    const results = await pool.query(
      "SELECT * FROM notes WHERE creator=$1 AND title=$2",
      [creator, title]
    );
    return results.rows;
  } catch (err) {
    throw err;
  }
};

const findNoteByCreatorAndType = async function (creator, type) {
  try {
    const results = await pool.query(
      "SELECT * FROM notes WHERE creator=$1 AND type=$2",
      [creator, type]
    );
    return results.rows;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  insertNewNoteToDB,
  findNoteByCreatorAndTitle,
  findNoteByCreatorAndType,
};
