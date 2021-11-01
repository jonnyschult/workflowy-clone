const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const pool = require("../db/db");

const getUser = async (token, req) => {
  try {
    if (token === "") {
      return null;
    }
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const results = await pool.query(
      "SELECT * FROM user_account WHERE id = $1",
      [id]
    );
    return results.rows[0] ? results.rows[0] : null;
  } catch (error) {
    console.log(error);
    return "Invalid token. Please login again.";
  }
};

module.exports = getUser;
