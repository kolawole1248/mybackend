const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
console.log(888888)
  const nav = await utilities.getNav()
 
  res.render("index", {title: "Home", nav})
}

module.exports = baseController