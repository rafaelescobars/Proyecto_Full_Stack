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
    GROUP BY s.date, o.name`;
  const values = [];
  return pool.query(queryGen(name, text, values));
};

module.exports = {
  salesGetQuery,
};
