const pool = require("../../../db");

const findUserByEmail = async function (email) {
  try {
    const user = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);
    return user.rows;
  } catch (err) {
    throw err;
  }
};
const findUserById = async function (id) {
  try {
    const user = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
    return user.rows;
  } catch (err) {
    throw err;
  }
};

const insertUserToDB = async function (name, email, password) {
  try {
    const results = await pool.query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, password`,
      [name, email, password]
    );
    return results.rows;
  } catch (err) {
    throw err;
  }
};

module.exports = { findUserByEmail, findUserById, insertUserToDB };
