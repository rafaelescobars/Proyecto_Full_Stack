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

const salesGetQuery = () => {
  const name = "todaySalesByOwner";
  const text = `
    SELECT	o.name AS owner,
      p.name AS product,
      SUM(ps.quantity) AS quantity,
      SUM(ps.quantity * ps.sale_price) AS total
    FROM sales s
    JOIN products_sales ps
    ON ps.sale_id=s.id
    LEFT JOIN products p
    ON p.id=ps.product_id
    LEFT JOIN owners o
    ON p.owner_id=o.id
    WHERE s.date=CURRENT_DATE
    AND s.status=true
    GROUP BY s.date, o.name, p.name, o.id
    ORDER BY o.id`;
  const values = [];
  return pool.query(queryGen(name, text, values));
};

const totalSalesGetQuery = () => {
  const name = "totalSalesGetQuery";
  const text = `
  SELECT SUM(ps.quantity*ps.sale_price) AS total
  FROM products_sales AS ps
  JOIN sales s
    ON s.id=ps.sale_id
  WHERE s.date=CURRENT_DATE`;
  const values = [];
  return pool.query(queryGen(name, text, values)).then((res) => res.rows[0]);
};

const paymentTypesGetQuery = () => {
  const name = "paymentTypesGetQuery";
  const text = `
    SELECT payment_type AS payment_type,
            SUM(ps.quantity * ps.sale_price) AS total
    FROM sales s
    JOIN products_sales ps
      ON ps.sale_id=s.id
    WHERE s.date=CURRENT_DATE 
      AND s.payment_type IS NOT NULL
    GROUP BY s.payment_type`;
  const values = [];
  return pool.query(queryGen(name, text, values)).then((res) => res.rows);
};

const totalPaymentTypesGetQuery = () => {
  const name = "totalPaymentTypesGetQuery";
  const text = `
    SELECT SUM(ps.quantity * ps.sale_price) AS total
    FROM products_sales ps
    JOIN sales s
      ON s.id=ps.sale_id
    WHERE s.payment_type IS NOT NULL AND s.date=CURRENT_DATE`;
  const values = [];
  return pool.query(queryGen(name, text, values)).then((res) => res.rows[0]);
};

module.exports = {
  salesGetQuery,
  totalSalesGetQuery,
  paymentTypesGetQuery,
  totalPaymentTypesGetQuery,
};
