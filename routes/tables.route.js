const jwt = require("jsonwebtoken");
const { Router } = require("express");

const {
  tablePostQuery,
  userPostQuery,
  userGetQuery,
  userPutQuery,
  userDeleteQuery,
  tablesGetQuery,
  localTablesGet,
  tableGetQuery,
  productTablePostQuery,
  productSaleGetQuery,
  productSalePutQuery,
} = require("../queries/tablesQueries.js");

const {
  productsGetQuery,
  productPriceGetQuery,
} = require("../queries/productsQueries.js");

const secretKey = process.env.SECRET_KEY;

const router = Router();

//body-parser
// const bodyParser = require("body-parser");
// router.use(bodyParser.urlencoded({ extended: false }));
// router.use(bodyParser.json());

//middleware /
router.use("/", (req, res, next) => {
  try {
    req.loggedUSer = jwt.verify(req.cookies.token, secretKey).data;
    next();
  } catch (err) {
    res.redirect("/login");
  }
});

//Route users GET
router.get("/", (req, res) => {
  if (req.loggedUSer != undefined) {
    tablesGetQuery().then((value) => {
      // console.log(value);
      res.render("tables", {
        userType: req.loggedUSer.admin,
        userId: req.loggedUSer.id,
        userEmail: req.loggedUSer.email,
        tables: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        ocupiedTables: value,
      });
    });
  } else {
    res.redirect("/login");
  }
});

//Route users GET
router.get("/ocupied", (req, res) => {
  if (req.loggedUSer != undefined) {
    tablesGetQuery().then((value) => {
      res.send(value);
    });
  } else {
    res.redirect("/login");
  }
});

//Route newUser GET
router.get("/new/:localTable", (req, res) => {
  if (req.loggedUSer != undefined) {
    const { localTable } = req.params;

    productsGetQuery().then(
      (value) => {
        res.render("newTable", {
          userType: req.loggedUSer.admin,
          userId: req.loggedUSer.id,
          userEmail: req.loggedUSer.email,
          localTable,
          products: value,
        });
      },
      (reason) => {
        console.log(reason);
      }
    );
  } else {
    res.redirect("/login");
  }
});

//Route product/price GET
router.get("/product/price/:id", (req, res) => {
  if (req.loggedUSer != undefined) {
    // const { id } = req.body;
    const { id } = req.params;
    productPriceGetQuery(Object.values(id)).then(
      (value) => {
        res.send(value);
      },
      (reason) => {
        console.log(reason);
      }
    );
  } else {
    res.redirect("/login");
  }
});

//Route newUser POST
router.post("/new/products/new", (req, res) => {
  if (req.loggedUSer != undefined) {
    const { localTable, userId, productId, productQuantity, productPrice } =
      req.body;

    const dataSales = Object.values({ localTable, userId });
    tablePostQuery(dataSales).then(
      (value) => {
        const saleId = value.rows[0].id;
        const dataProductsSales = Object.values({
          saleId,
          productId,
          productQuantity,
          productPrice,
        });
        productTablePostQuery(dataProductsSales).then(
          (value) => {
            console.log(value);
            res.send(value.rows[0]);
          },
          (reason) => {
            console.log(reason);
          }
        );
      },
      (reason) => {
        console.log(reason);
      }
    );
  }
});

//Route editUSer GET
router.get("/edit/:saleId", (req, res) => {
  if (req.loggedUSer != undefined) {
    // console.log(req.loggedUSer.admin);
    const { saleId } = req.params;
    // console.log(saleId);
    tableGetQuery([saleId]).then(
      (value) => {
        // console.log(value);
        res.render("editTable", {
          tableProducts: value,
          localTable: value[0].local_table,
          userType: req.loggedUSer.admin,
          userId: req.loggedUSer.id,
          userEmail: req.loggedUSer.email,
        });
      },
      (reason) => {
        console.log(reason);
      }
    );
  } else {
    res.redirect("/login");
  }
});

//Route product/edit/:productSaleId
router.get("/:localTable/product/edit/:productSaleId", (req, res) => {
  if (req.loggedUSer != undefined) {
    const { productSaleId, localTable } = req.params;
    //  console.log(req.body);
    productsGetQuery().then(
      (value) => {
        res.render("editProductTable", {
          products: value,
          productSaleId,
          localTable,
          userType: req.loggedUSer.admin,
          userId: req.loggedUSer.id,
          userEmail: req.loggedUSer.email,
        });
      },
      (reason) => {
        console.log(reason);
      }
    );
  }
});

//Route product/edit/:productSaleId
router.get("/products/edit/:productSaleId", (req, res) => {
  if (req.loggedUSer != undefined) {
    const { productSaleId } = req.params;
    productSaleGetQuery([productSaleId]).then(
      (value) => {
        res.send(value);
      },
      (reason) => {
        console.log(reason);
      }
    );
  }
});

//Route product/edit/:productSaleId
router.put("/product", (req, res) => {
  if (req.loggedUSer != undefined) {
    // console.log(req.body);
    productSalePutQuery(Object.values(req.body)).then(
      (value) => {
        // console.log(value);
        res.send(value);
      },
      (reason) => {
        console.log(reason);
      }
    );
  }
});

//Route editUser PUT
router.put("/edit", (req, res) => {
  if (req.loggedUSer != undefined) {
    userPutQuery(Object.values(req.body)).then(
      (value) => {
        res.sendStatus("200");
      },
      (reason) => {
        console.log(reason);
      }
    );
  }
});

//Route deleteUser DELETE
router.delete("/delete/:id", (req, res) => {
  if (req.loggedUSer != undefined) {
    const { id } = req.params;
    userDeleteQuery([id]).then(
      (value) => {
        // res.redirect('/')
        res.sendStatus(200);
      },
      (reason) => {
        console.log(reason);
      }
    );
  }
});

module.exports = router;
