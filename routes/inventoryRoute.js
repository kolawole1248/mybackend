const express = require('express');
const router = express.Router();
const invController = require('../controllers/inventoryController');

router.get('/:inv_id', invController.buildByInventoryId);

module.exports = router;