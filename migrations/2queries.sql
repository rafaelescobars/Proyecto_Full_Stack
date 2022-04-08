--Cambiarse a base postgres
\c postgres;

-- Create a new database called 'full_stack'
 CREATE DATABASE full_stack;

--Conexión base library
\c full_stack;

--Encoding UTF8
SET client_encoding TO 'UTF8';

--Extensión
--CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--Crear Tablas
CREATE TABLE owners(
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

CREATE TABLE products(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(400) NOT NULL,
  price INT NOT NULL,
  owner_id SMALLINT 
    REFERENCES owners(id)
);

CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  email VARCHAR(80) NOT NULL,
  password VARCHAR(100) NOT NULL,
  admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE sales(
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  client_name VARCHAR(100),
  adress VARCHAR(256),
  local_table SMALLINT,
  user_id SMALLINT  
    REFERENCES users(id),
  status BOOLEAN NOT NULL DEFAULT FALSE,
  payment_type VARCHAR(12)
);

CREATE TABLE products_sales(
  id SERIAL PRIMARY KEY,
  sale_id INT
    REFERENCES sales(id),
  product_id SMALLINT
    REFERENCES products(id),
  quantity SMALLINT NOT NULL CHECK(quantity>=0),
  sale_price INT NOT NULL
);

INSERT INTO users(email, password, admin) VALUES('user@admin.com', 'password', true);