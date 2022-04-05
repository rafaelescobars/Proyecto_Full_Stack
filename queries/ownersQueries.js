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

const ownerPostQuery = (data) => {
  const name = "ownerPostQuery";
  const text = "INSERT INTO owners (name) VALUES ($1)";
  const values = data;
  return pool.query(queryGen(name, text, values));
};

const ownersGetQuery = () => {
  const name = "ownersGetQuery";
  const text = "SELECT * FROM owners ORDER BY id";
  const values = [];
  return pool.query(queryGen(name, text, values)).then((res) => res.rows);
};

const ownerGetQuery = (data) => {
  const name = "ownerGetQuery";
  const text = "SELECT * FROM owners WHERE id=$1";
  const values = data;
  return pool.query(queryGen(name, text, values)).then((res) => res.rows[0]);
};

const ownerPutQuery = (data) => {
  const name = "ownerPutQuery";
  const text = "UPDATE owners SET name=$2 WHERE id=$1";
  const values = data;
  return pool.query(queryGen(name, text, values)).then((res) => res.rows);
};

const ownerDeleteQuery = (data) => {
  const name = "ownerDeleteQuery";
  const text = "DELETE FROM owners WHERE id=$1";
  const values = data;
  return pool.query(queryGen(name, text, values));
};

module.exports = {
  ownerPostQuery,
  ownersGetQuery,
  ownerPutQuery,
  ownerGetQuery,
  ownerDeleteQuery,
};
