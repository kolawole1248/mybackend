const utilities = require("../utilities/");

const baseController = {
  buildHome: async function(req, res) {
    try {
      const nav = await utilities.getNav();
      req.flash('info', 'This is CSE Motors!'); // Flash message example
      
      res.render("layouts/layout", {
        title: "Home",
        nav,
        messages: {
          info: req.flash('info'),
          error: req.flash('error'),
          success: req.flash('success')
        }
      });
    } catch (error) {
      req.flash('error', 'Error loading navigation');
      res.redirect('/');
    }
  }
};

module.exports = baseController;