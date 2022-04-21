const jwt = require("jsonwebtoken");
const { Router } = require("express");

const {
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
  productTableGetQuery,
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

//Route edit:SaleId GET
router.get("/edit/:saleId", (req, res) => {
  if (req.loggedUSer != undefined) {
    // console.log(req.loggedUSer.admin);
    const { saleId, localTable } = req.params;
    // console.log(saleId);
    tableGetQuery([saleId]).then(
      (value) => {
        // console.log(value);
        res.render("editTable", {
          saleId,
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

//Route /new/products/new POST
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
            // console.log(value);
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

//Route /product/add Put
router.put("/product/add", (req, res) => {
  if (req.loggedUSer != undefined) {
    const { productTableId } = req.body;
    // console.log(productTableId);
    addProductTablePutQuery([productTableId]).then(
      (value) => {
        res.sendStatus(200);
      },
      (reason) => {
        console.log(reason);
      }
    );
  }
});

//Route /product/sub GET
router.put("/product/sub", (req, res) => {
  if (req.loggedUSer != undefined) {
    const { productTableId } = req.body;
    // console.log(productTableId);
    subProductTablePutQuery([productTableId]).then(
      (value) => {
        res.sendStatus(200);
      },
      (reason) => {
        console.log(reason);
      }
    );
  }
});

//Route editUSer GET
router.delete("/product", (req, res) => {
  if (req.loggedUSer != undefined) {
    // console.log(req.body);
    const { productTableId, saleId } = req.body;
    // console.log(productTableId);
    productTableDeleteQuery([productTableId]).then(
      (productTableDeleteValue) => {
        tableGetQuery([saleId]).then(
          (tableGetValue) => {
            if ((tableGetValue = [])) {
              tableDeleteQuery([saleId]).then(
                (tableDeleteValue) => {
                  // console.log(saleId);
                  // console.log("ok");
                },
                (reason) => {
                  console.log(reason);
                }
              );
            }
          },
          (reason) => {
            console.log(reason);
          }
        );
        res.sendStatus(200);
      },
      (reason) => {
        console.log(reason);
      }
    );
  }
});

//Route /product/new/:saleId GET
router.get("/:localTable/product/new/:saleId", (req, res) => {
  if (req.loggedUSer != undefined) {
    const { saleId, localTable } = req.params;
    productsGetQuery().then(
      (value) => {
        res.render("newProductTable", {
          saleId,
          localTable,
          products: value,
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

//Route /new/products/new POST
router.post("/product/new", (req, res) => {
  if (req.loggedUSer != undefined) {
    // const { saleId, productId, productQuantity, productPrice } =
    //   req.body;

    productTablePostQuery(Object.values(req.body)).then(
      (value) => {
        // console.log(value);
        res.send(value.rows[0]);
      },
      (reason) => {
        console.log(reason);
      }
    );
  }
});

//Route /pay/:saleId GET
router.get("/pay/:saleId", (req, res) => {
  if (req.loggedUSer != undefined) {
    // console.log(req.loggedUSer.admin);
    const { saleId, localTable } = req.params;
    // console.log(saleId);
    tableGetQuery([saleId]).then(
      (value) => {
        // console.log(value);
        res.render("payTable", {
          saleId,
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

//Route pay PUT
router.put("/pay", (req, res) => {
  if (req.loggedUSer != undefined) {
    // console.log(saleId);
    // console.log(req.body);
    payTablePutQuery(Object.values(req.body)).then(
      (value) => {
        res.sendStatus(200);
      },
      (reason) => {
        console.log(reason);
      }
    );
  }
});

router.get("/product/:id", (req, res) => {
  if (req.loggedUSer != undefined) {
    const { id } = req.params;
    productTableGetQuery([id]).then(
      (value) => {
        res.send(value);
      },
      (reason) => {
        console.log(reason);
      }
    );
  }
});

module.exports = router;
