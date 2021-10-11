const pool = require("../../db/db");
const { getQueryArgs } = require("../../../utils");

const login = async (_, args) => {
  try {
    const [queryString, valArray] = getQueryArgs(
      "select",
      "user_account",
      args
    );
    const results = await pool.query(queryString, valArray);
    return results.rows[0];
  } catch (error) {
    return {
      success: false,
      message: "query failed",
      task: [],
    };
  }
};

const userQueries = {
  Query: {
    login,
  },
};

module.exports = userQueries;
