const express = require("express");
const router = express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const validate = require("../utilities/account-validation");

// GET login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// POST process login
router.post(
  "/login",
  validate.loginRules(),
  validate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// GET registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// POST process registration
router.post(
  "/register",
  validate.registrationRules(),
  validate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

module.exports = router;