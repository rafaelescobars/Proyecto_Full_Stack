const jwt = require("jsonwebtoken");
const { Router } = require("express");

const {
  usersGetQuery,
  userPostQuery,
  userGetQuery,
  userPutQuery,
  userDeleteQuery,
} = require("../queries/usersQueries.js");

const secretKey = process.env.SECRET_KEY;

const router = Router();

//middleware /
router.use("/", (req, res, next) => {
  try {
    req.loggedUSer = jwt.verify(req.cookies.token, secretKey).data;
    next();
  } catch (err) {
    res.redirect("/login");
    // console.log(err);
  }
});

//Route users GET
router.get("/", (req, res) => {
  if (req.loggedUSer != undefined && req.loggedUSer.admin == true) {
    // console.log(req.loggedUSer.admin);

    usersGetQuery().then((value) => {
      res.render("users", {
        userType: req.loggedUSer.admin,
        users: value,
        userId: req.loggedUSer.id,
        userEmail: req.loggedUSer.email,
      });
    });
  } else {
    res.redirect("/login");
  }
});

//Route newUser GET
router.get("/new", (req, res) => {
  if (req.loggedUSer != undefined && req.loggedUSer.admin == true) {
    // console.log(req.loggedUSer.admin);
    res.render("newUser", {
      userType: req.loggedUSer.admin,
      userId: req.loggedUSer.id,
      userEmail: req.loggedUSer.email,
    });
  } else {
    res.redirect("/login");
  }
});

//Route newUser POST
router.post("/new", (req, res) => {
  if (req.loggedUSer != undefined && req.loggedUSer.admin == true) {
    userPostQuery(Object.values(req.body)).then(
      (value) => {
        res.sendStatus("200");
      },
      (reason) => {
        console.log(reason);
      }
    );
  }
});

//Route editUSer GET
router.get("/edit/:id", (req, res) => {
  if (req.loggedUSer != undefined && req.loggedUSer.admin == true) {
    // console.log(req.loggedUSer.admin);
    const { id } = req.params;
    userGetQuery([id]).then(
      (value) => {
        res.render("editUser", {
          user: value,
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

//Route editUser PUT
router.put("/edit", (req, res) => {
  if (req.loggedUSer != undefined && req.loggedUSer.admin == true) {
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
  if (req.loggedUSer != undefined && req.loggedUSer.admin == true) {
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
