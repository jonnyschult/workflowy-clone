const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const pool = require("../db/db");

const getUser = async (token) => {
  try {
    if (token === "") {
      return null;
    }
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const results = await pool.query(
      "SELECT * FROM user_account WHERE id = $1",
      [id]
    );
    const user = results.rows[0];
    return user;
  } catch (error) {
    console.log(error);
    return "Invalid token. Please login again.";
  }
};

module.exports = getUser;
