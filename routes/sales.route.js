const jwt = require("jsonwebtoken");
const { Router } = require("express");

const {
  salesGetQuery,
  totalSalesGetQuery,
  paymentTypesGetQuery,
  totalPaymentTypesGetQuery,
} = require("../queries/salesQueries.js");

const secretKey = process.env.SECRET_KEY;

const router = Router();

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
  if (req.loggedUSer != undefined && req.loggedUSer.admin == true) {
    salesGetQuery().then((salesValue) => {
      totalSalesGetQuery().then(
        (totalSalesValue) => {
          paymentTypesGetQuery().then(
            (paymentTypesValue) => {
              totalPaymentTypesGetQuery().then(
                (totalPaymentTypesValue) => {
                  // console.log(paymentTypesValue);
                  res.render("sales", {
                    userType: req.loggedUSer.admin,
                    userId: req.loggedUSer.id,
                    userEmail: req.loggedUSer.email,
                    sales: salesValue.rows,
                    totalSales: totalSalesValue.total,
                    paymentTypes: paymentTypesValue,
                    totalPaymentType: totalPaymentTypesValue.total,
                  });
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
        },
        (reason) => {
          console.log(reason);
        }
      );
    });
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
