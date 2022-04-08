const jwt = require("jsonwebtoken");
const { Router } = require("express");

const { salesGetQuery } = require("../queries/salesQueries.js");

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
  if (req.loggedUSer != undefined && req.loggedUSer.admin == true) {
    salesGetQuery().then((value) => {
      // console.log(value);
      res.render("sales", {
        userType: req.loggedUSer.admin,
        userId: req.loggedUSer.id,
        userEmail: req.loggedUSer.email,
        sales: value.rows,
      });
    });
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
