const invModel = require('../models/inventory-model');
const utilities = require('../utilities');

async function buildByInventoryId(req, res, next) {
  try {
    const inv_id = req.params.inv_id;
    const data = await invModel.getInventoryItemById(inv_id);
    
    if (!data) {
      throw new Error('Inventory item not found');
    }
    
    const detailHTML = await utilities.buildInventoryDetail(data);
    res.render('inventory/detail', {
      title: `${data.inv_make} ${data.inv_model}`,
      detailHTML
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { buildByInventoryId };