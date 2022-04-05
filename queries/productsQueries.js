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

const productPostQuery = (data) => {
  pool.query(`BEGIN`);
  // pool.query(`SAVEPOINT checkpoint`);
  const name = "productPostQuery";
  const text = `
        INSERT INTO products 
          (name, description, owner_id, price) 
            VALUES
            ($1, $2, $3, $4)
        `;
  const values = data;
  return pool.query(queryGen(name, text, values));
};

const productsGetQuery = () => {
  const name = "productsGetQuery";
  const text = `
    SELECT
        p.id AS id, p.name AS name, p.description AS description, p.price AS price, o.name AS owner 
    FROM products AS p 
    JOIN owners AS o 
    ON o.id=p.owner_id 
    ORDER BY owner DESC, p.id`;
  const values = [];
  return pool.query(queryGen(name, text, values)).then((res) => res.rows);
};

const productPriceGetQuery = (data) => {
  const name = "productPriceGetQuery";
  const text = `
    SELECT price FROM products WHERE id=$1`;
  const values = data;
  return pool.query(queryGen(name, text, values)).then((res) => res.rows[0]);
};

const productGetQuery = (data) => {
  const name = "productGetQuery";
  const text = `
    SELECT * FROM products WHERE id=$1`;
  const values = data;
  return pool.query(queryGen(name, text, values)).then((res) => res.rows[0]);
};

const productPutQuery = (data) => {
  const name = "productPutQuery";
  const text =
    "UPDATE products SET name=$2, description=$3, owner_id=$4, price=$5 WHERE id=$1";
  const values = data;
  return pool.query(queryGen(name, text, values)).then((res) => res.rows);
};

const productDeleteQuery = (data) => {
  const name = "userDeleteQuery";
  const text = "DELETE FROM products WHERE id=$1";
  const values = data;
  return pool.query(queryGen(name, text, values));
};

module.exports = {
  productPostQuery,
  productsGetQuery,
  productPutQuery,
  productGetQuery,
  productDeleteQuery,
  productPriceGetQuery,
};
