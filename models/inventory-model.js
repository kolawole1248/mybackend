const pool = require("../database/"); // Only declare ONCE at the top

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}

/* ***************************
 *  Get inventory item by ID
 * ************************** */
async function getInventoryItemById(inv_id) {
    console.log(inv_id,'******************')
  try {
    const sql = `SELECT * FROM inventory WHERE inv_id = $1`;
    const data = await pool.query(sql, [inv_id]);
    return data.rows[0];
  } catch (error) {
    console.error("Error getting inventory item by ID:", error);
    return null;
  }
}

// Export BOTH functions in a single module.exports
module.exports = { getClassifications, getInventoryItemById };