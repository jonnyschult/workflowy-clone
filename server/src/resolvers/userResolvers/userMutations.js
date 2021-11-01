const { getQueryArgs } = require("../../../utils");
const dotenv = require("dotenv");
const { v4: uuid } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
dotenv.config();

const register = async (_, args, context) => {
  try {
    const { pool } = context;
    const user = args.createUserInput;
    user.id = uuid();
    user.passwordhash = bcrypt.hashSync(user.password, 10);
    delete user.password;
    const [queryString, valArray] = getQueryArgs(
      "insert",
      "user_account",
      user
    );
    const results = await pool.query(queryString, valArray);
    const token = jwt.sign({ id: results.rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return {
      success: true,
      message: "Account created!",
      token,
      user: results.rows[0],
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: error,
      token,
    };
  }
};

const userMutations = {
  Mutation: {
    register,
  },
};

module.exports = userMutations;
