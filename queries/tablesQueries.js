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

const tablePostQuery = (data) => {
  const name = "tablePostQuery";
  const text =
    "INSERT INTO sales (local_table, user_id) values ($1, $2) RETURNING id";
  const values = data;
  return pool.query(queryGen(name, text, values));
};

const productTablePostQuery = (data) => {
  const name = "productTablePostQuery";
  const text =
    "INSERT INTO products_sales (sale_id, product_id, quantity, sale_price) values ($1, $2, $3, $4) RETURNING sale_id";
  const values = data;
  return pool.query(queryGen(name, text, values));
};

const tablesGetQuery = () => {
  const name = "tablesGetQuery";
  const text = `
    SELECT s.id AS id,
          s.local_table AS local_table, 
          u.email AS email,
          SUM(ps.quantity * ps.sale_price) AS total,
          s.status AS status
    FROM sales s
    JOIN users u ON u.id=s.user_id
    JOIN products_sales ps ON s.id=ps.sale_id
    WHERE local_table IS NOT NULL
    AND status=FALSE
    AND date=CURRENT_DATE
    GROUP BY s.id, local_table, email, status, payment_type
    ORDER BY local_table`;
  const values = [];
  return pool.query(queryGen(name, text, values)).then((res) => res.rows);
};

const localTablesGet = () => {
  const name = "localTablesGet";
  const text = `
    SELECT local_table FROM sales WHERE status=TRUE AND date=CURRENT_DATE`;
  const values = [];
  return pool.query(queryGen(name, text, values)).then((res) => res.rows);
};

const tableGetQuery = (data) => {
  const name = "tablesPostQuery";
  const text = `
    SELECT ps.id AS id,
          p.name AS product_name, 
          ps.quantity AS quantity,
          ps.sale_price AS sale_price,
          (quantity * sale_price) AS total,
          s.local_table AS local_table
    FROM products_sales ps
    JOIN products p ON p.id=ps.product_id
    JOIN sales s ON s.id=ps.sale_id
    WHERE s.date=CURRENT_DATE
    AND s.id=$1`;
  const values = data;
  return pool.query(queryGen(name, text, values)).then((res) => res.rows);
};

const productSaleGetQuery = (data) => {
  const name = "productSaleGetQuery";
  const text = "SELECT * FROM products_sales WHERE id=$1";
  const values = data;
  return pool.query(queryGen(name, text, values)).then((res) => res.rows[0]);
};

const productSalePutQuery = (data) => {
  const name = "productSalePutQuery";
  const text =
    "UPDATE products_sales SET product_id=$2, quantity=$3, sale_price=$4 WHERE id=$1 RETURNING sale_id";
  const values = data;
  return pool.query(queryGen(name, text, values)).then((res) => res.rows[0]);
};

// const userGetQuery = (data) => {
//   const name = "userGetQuery";
//   const text = "SELECT * FROM users WHERE id=$1";
//   const values = data;
//   return pool.query(queryGen(name, text, values)).then((res) => res.rows[0]);
// };

// const userPutQuery = (data) => {
//   const name = "userPutQuery";
//   const text = "UPDATE users SET email=$2, password=$3 WHERE  id=$1";
//   const values = data;
//   return pool.query(queryGen(name, text, values)).then((res) => res.rows);
// };

// const userDeleteQuery = (data) => {
//   const name = "userDeleteQuery";
//   const text = "DELETE FROM users WHERE id=$1";
//   const values = data;
//   return pool.query(queryGen(name, text, values));
// };

// const ownersGetQuery = (data) => {
//   const name = "ownersGetQuery";
//   const text = "SELECT * FROM owners ORDER BY id";
//   const values = data;
//   return pool.query(queryGen(name, text, values)).then((res) => res.rows);
// };

// const productsGetQuery = (data) => {
//   const name = "productsGetQuery";
//   const text = "SELECT * FROM products ORDER BY id";
//   const values = data;
//   return pool.query(queryGen(name, text, values)).then((res) => res.rows);
// };

module.exports = {
  tablePostQuery,
  tablesGetQuery,
  // userPutQuery,
  // userGetQuery,
  // userDeleteQuery,
  localTablesGet,
  tableGetQuery,
  productTablePostQuery,
  productSaleGetQuery,
  productSalePutQuery,
};
