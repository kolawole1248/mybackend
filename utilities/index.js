const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  let data = await invModel.getClassifications();
  console.log(data);
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* ************************
 * Builds inventory detail HTML
 ************************** */
Util.buildInventoryDetail = function (data) {
  return `
    <div class="inventory-detail">
      <div class="detail-image">
        <img id='vehicleImage' src="${data.inv_image}" alt="${data.inv_make} ${data.inv_model}">
      </div>
      <div class="detail-info">
        <h2>${data.inv_year} ${data.inv_make} ${data.inv_model}</h2>
        <p class="price">Price: $${new Intl.NumberFormat('en-US').format(data.inv_price)}</p>
        <p class="mileage">Mileage: ${new Intl.NumberFormat('en-US').format(data.inv_miles)} miles</p>
        <p class="color">Color: ${data.inv_color}</p>
        <p class="description">${data.inv_description}</p>
      </div>
    </div>
  `;
};

// Single export statement
module.exports = Util;