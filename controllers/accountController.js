const utilities = require('../utilities');
const accountModel = require('../models/account-model');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const accountController = {
  /* ************************
  *  Deliver login view
  * ************************ */
  buildLogin: async function(req, res, next) {
    try {
      let nav = await utilities.getNav();
      res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
        messages: {
          notice: req.flash('notice') || null,
          error: req.flash('error') || null
        },
        formData: req.flash('formData')[0] || null
      });
    } catch (error) {
      console.error("Login view error:", error);
      next(error);
    }
  },

  /* ************************
  *  Deliver registration view
  * ************************ */
  buildRegister: async function(req, res, next) {
    try {
      let nav = await utilities.getNav();
      res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
        messages: {
          notice: req.flash('notice') || null,
          error: req.flash('error') || null
        },
        formData: req.flash('formData')[0] || null
      });
    } catch (error) {
      console.error("Registration view error:", error);
      next(error);
    }
  },

  /* ************************
  *  Process Registration
  * ************************ */
  registerAccount: async function(req, res, next) {
    try {
      let nav = await utilities.getNav();
      const { 
        account_firstname, 
        account_lastname, 
        account_email, 
        account_password 
      } = req.body;

      // Check for validation errors from express-validator
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash("error", errors.array().map(err => err.msg).join(', '));
        req.flash("formData", req.body);
        return res.status(400).render("account/register", {
          title: "Registration",
          nav,
          errors: errors.array(),
          messages: {
            error: req.flash('error')[0] || null
          },
          account_firstname,
          account_lastname,
          account_email
        });
      }

      // Check if email already exists (additional check even if validator passed)
      const emailExists = await accountModel.checkExistingEmail(account_email);
      if (emailExists) {
        req.flash("error", "Email already exists. Please log in or use different email.");
        req.flash("formData", req.body);
        return res.status(400).redirect("/account/register");
      }

      // Hash password before storing
      const hashedPassword = await bcrypt.hash(account_password, 10);

      const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
      );

      if (regResult.rowCount) {
        req.flash(
          "notice",
          `Congratulations, you're registered ${account_firstname}. Please log in.`
        );
        return res.status(201).redirect("/account/login");
      } else {
        throw new Error("Registration failed - no rows affected");
      }
    } catch (error) {
      console.error("Registration processing error:", error);
      req.flash("error", "Registration error. Please try again.");
      req.flash("formData", req.body);
      return res.status(500).redirect("/account/register");
    }
  },

  /* ************************
  *  Process Login
  * ************************ */
  accountLogin: async function(req, res, next) {
    try {
      let nav = await utilities.getNav();
      const { account_email, account_password } = req.body;
      
      // Basic validation
      if (!account_email || !account_password) {
        req.flash("error", "Please provide both email and password");
        return res.status(400).redirect("/account/login");
      }

      // Check credentials
      const accountData = await accountModel.getAccountByEmail(account_email);
      if (!accountData) {
        req.flash("error", "Invalid email or password");
        return res.status(401).redirect("/account/login");
      }

      const passwordMatch = await bcrypt.compare(account_password, accountData.account_password);
      if (!passwordMatch) {
        req.flash("error", "Invalid email or password");
        return res.status(401).redirect("/account/login");
      }

      // Login successful
      req.session.account = {
        id: accountData.account_id,
        firstname: accountData.account_firstname,
        lastname: accountData.account_lastname,
        email: accountData.account_email,
        type: accountData.account_type
      };

      req.flash("notice", `Welcome back ${accountData.account_firstname}!`);
      return res.redirect("/account/");
      
    } catch (error) {
      console.error("Login processing error:", error);
      req.flash("error", "Login error. Please try again.");
      return res.status(500).redirect("/account/login");
    }
  }
};

module.exports = accountController;