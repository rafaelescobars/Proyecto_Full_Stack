//req
require("dotenv").config("/");
const { Client, Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;

const pool = new Pool(
  connectionString
    ? {
        connectionString,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : undefined
);

//genQuery
const queryGen = (name, text, values) => {
  return {
    name,
    text,
    values,
  };
};

const loginPostQuery = (data) => {
  const name = "postLogin";
  const text = "SELECT * FROM users WHERE email=$1 and password=$2";
  const values = data;
  return pool.query(queryGen(name, text, values)).then((res) => res.rows[0]);
};

module.exports = {
  loginPostQuery,
};
