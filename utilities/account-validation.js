const { body, validationResult } = require("express-validator");
const utilities = require(".");
const accountModel = require("../models/account-model");

const validate = {};

/* ************************
 * Registration Validation Rules
 * ************************ */
validate.registrationRules = () => {
  return [
    // First name validation
    body("account_firstname")
      .trim()
      .notEmpty()
      .withMessage("Please provide a first name."),

    // Last name validation
    body("account_lastname")
      .trim()
      .notEmpty()
      .withMessage("Please provide a last name."),

    // Email validation
    body("account_email")
      .trim()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),

    // Password validation
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      })
      .withMessage("Password must be at least 12 characters with uppercase, lowercase, number, and special character")
  ];
};

/* ************************
 * Login Validation Rules
 * ************************ */
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .notEmpty()
      .isEmail()
      .withMessage("A valid email is required"),
      
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
  ];
};

/* ************************
 * Check Registration Data
 * ************************ */
validate.checkRegData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    return res.render("account/register", {
      title: "Registration",
      nav,
      errors: errors.array(),
      account_firstname: req.body.account_firstname,
      account_lastname: req.body.account_lastname,
      account_email: req.body.account_email
    });
  }
  next();
};

/* ************************
 * Check Login Data
 * ************************ */
validate.checkLoginData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    return res.render("account/login", {
      title: "Login",
      nav,
      errors: errors.array(),
      account_email: req.body.account_email
    });
  }
  next();
};

module.exports = validate;