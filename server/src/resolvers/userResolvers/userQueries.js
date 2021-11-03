const pool = require("../../db/db");
const { getQueryArgs } = require("../../../utils");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (_, args) => {
  try {
    const { password, email } = args;
    const [queryString, valArray] = getQueryArgs("select", "user_account", {
      email,
    });
    const results = await pool.query(queryString, valArray);
    if (results.rowCount === 0) {
      throw "No user found with that email.";
    }
    const user = results.rows[0];

    const validPass = await bcrypt.compare(password, user.passwordhash);

    if (!validPass) {
      throw "Invalid password.";
    }

    const token = jwt.sign({ id: results.rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return {
      success: true,
      message: "Success. You are now logged in.",
      user,
      token,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: error,
      user: null,
      token: null,
    };
  }
};

const getUser = async (_, __, context) => {
  try {
    const { user } = context;
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return {
      success: true,
      message: "Success. You are now logged in.",
      user,
      token,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: error,
      user: null,
      token: null,
    };
  }
};

const userQueries = {
  Query: {
    login,
    getUser,
  },
};

module.exports = userQueries;
