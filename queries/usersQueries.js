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

const userPostQuery = (data) => {
  const name = "postContender";
  const text = "INSERT INTO users (email, password) values ($1, $2)";
  const values = data;
  return pool.query(queryGen(name, text, values));
};

const usersGetQuery = () => {
  const name = "usersPostQuery";
  const text = "SELECT * FROM users ORDER BY id";
  const values = [];
  return pool.query(queryGen(name, text, values)).then((res) => res.rows);
};

const userGetQuery = (data) => {
  const name = "userGetQuery";
  const text = "SELECT * FROM users WHERE id=$1";
  const values = data;
  return pool.query(queryGen(name, text, values)).then((res) => res.rows[0]);
};

const userPutQuery = (data) => {
  const name = "userPutQuery";
  const text = "UPDATE users SET email=$2, password=$3 WHERE  id=$1";
  const values = data;
  return pool.query(queryGen(name, text, values)).then((res) => res.rows);
};

const userDeleteQuery = (data) => {
  const name = "userDeleteQuery";
  const text = "DELETE FROM users WHERE id=$1";
  const values = data;
  return pool.query(queryGen(name, text, values));
};

module.exports = {
  userPostQuery,
  usersGetQuery,
  userPutQuery,
  userGetQuery,
  userDeleteQuery,
};
