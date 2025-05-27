function errorHandler(err, req, res, next) {
  console.error(err.stack);
  
  let status = 500;
  let message = 'Internal Server Error';
  const nav = req.nav || '<ul><li><a href="/">Home</a></li></ul>'; // Fallback nav if not set
  
  if (err.message === 'Inventory item not found') {
    status = 404;
    message = 'Vehicle not found';
  }
  
  res.status(status).render('errors/error', {
    title: `${status} Error`,
    message,
    nav
  });
}

module.exports = errorHandler;