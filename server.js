const { loginPostQuery } = require("./queries/queries.js");

//express
const express = require("express");
const { engine } = require("express-handlebars");
const app = express();
const port = process.env.POR || 3000;

//handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

//public, bootstrap and axios
app.use(express.static("public"));
app.use(express.static("node_modules/bootstrap/dist"));
app.use(express.static("node_modules/axios/dist"));

//body-parser
// const bodyParser = require("body-parser");
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(express.json());

//Cookie
const cookieParser = require("cookie-parser");
app.use(cookieParser());

//secretKey
const secretKey = process.env.SECRET_KEY;

// jwt
const jwt = require("jsonwebtoken");

//Route /
app.get("/", (req, res) => {
  res.redirect("tables");
});

//Route login GET
app.get("/login", (req, res) => {
  res.render("login");
});

//Route login POST
app.post("/login", (req, res) => {
  const data = Object.values(req.body);

  if (req.body.email != "" && req.body.password != "") {
    loginPostQuery(data).then(
      (value) => {
        try {
          if (
            req.body.email == value.email &&
            req.body.password == value.password
          ) {
            const token = jwt.sign(
              {
                data: value,
              },
              secretKey,
              { expiresIn: "6h" }
            );

            res.cookie("token", token);
            res.sendStatus(200);
          }
        } catch (err) {
          console.log(err);
        }
      },
      (reason) => {
        console.log(reason);
        console.log("ok");
        res.redirect("/");
      }
    );
  }
});

//logout GET
app.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

//users
const users = require("./routes/users.route");
app.use("/users", users);

//owners
const owners = require("./routes/owners.route");
app.use("/owners", owners);

//tables
const tables = require("./routes/tables.route");
app.use("/tables", tables);

//products
const products = require("./routes/products.route");
app.use("/products", products);

//sales
const sales = require("./routes/sales.route");
app.use("/sales", sales);

//listen
app.listen(port, () => {
  console.log(`El servidor esta inicializado en el puerto ${port}`);
});
