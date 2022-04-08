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
  const name = "tableGetQuery";
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
    AND s.id=$1
    ORDER BY product_name`;
  const values = data;
  return pool.query(queryGen(name, text, values)).then((res) => res.rows);
};

const addProductTablePutQuery = (data) => {
  const name = "addProductTablePutQuery";
  const text = `
    UPDATE products_sales SET quantity=quantity+1 WHERE id=$1`;
  const values = data;
  return pool.query(queryGen(name, text, values)).then((res) => res.rows[0]);
};

const subProductTablePutQuery = (data) => {
  const name = "subProductTablePutQuery";
  const text = `
    UPDATE products_sales SET quantity=quantity-1 WHERE id=$1`;
  const values = data;
  return pool.query(queryGen(name, text, values)).then((res) => res.rows[0]);
};

const productTableDeleteQuery = (data) => {
  const name = "productTableDeleteQuery";
  const text = "DELETE FROM products_sales WHERE id=$1";
  const values = data;
  return pool.query(queryGen(name, text, values));
};

const tableDeleteQuery = (data) => {
  const name = "tableDeleteQuery";
  const text = "DELETE FROM sales WHERE id=$1";
  const values = data;
  return pool.query(queryGen(name, text, values));
};

const payTablePutQuery = (data) => {
  const name = "payTablePutQuery";
  const text = "UPDATE sales SET status=true, payment_type=$2 WHERE id=$1";
  const values = data;
  return pool.query(queryGen(name, text, values));
};

module.exports = {
  tablePostQuery,
  tablesGetQuery,
  localTablesGet,
  tableGetQuery,
  productTablePostQuery,
  addProductTablePutQuery,
  subProductTablePutQuery,
  productTableDeleteQuery,
  tableDeleteQuery,
  payTablePutQuery,
};
