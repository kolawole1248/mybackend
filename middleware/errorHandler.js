const utilities = require('../utilities');

async function errorHandler(err, req, res, next) {
  console.error('\x1b[31m', 'Error:', err.stack, '\x1b[0m'); // Colored error output
  
  try {
    let status = err.status || 500;
    let message = err.message || 'Internal Server Error';
    const nav = await utilities.getNav(); // Get proper navigation
    
    // Customize error responses based on error type
    switch (true) {
      case err.message.includes('not found'):
        status = 404;
        message = 'The requested resource was not found';
        break;
      case err.message.includes('validation failed'):
        status = 400;
        break;
      case err.name === 'UnauthorizedError':
        status = 401;
        message = 'Authentication required';
        break;
      case err.code === 'LIMIT_FILE_SIZE':
        status = 413;
        message = 'File size too large';
        break;
    }

    // Set response headers
    res.set('Cache-Control', 'no-store');

    // For API requests, return JSON
    if (req.originalUrl.startsWith('/api/')) {
      return res.status(status).json({
        error: {
          status,
          message,
          ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
      });
    }

    // For HTML requests, render error page
    const errorData = {
      title: `${status} Error`,
      nav,
      error: {  // Properly structured error object
        status,
        message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : null
      },
      env: process.env.NODE_ENV,
      layout: './layouts/error-layout' // Optional separate layout for errors
    };

    res.status(status).render('errors/error', errorData);

  } catch (error) {
    // Fallback if something goes wrong in the error handler
    console.error('\x1b[31m', 'Error handler failed:', error, '\x1b[0m');
    res.status(500).send(`
      <h1>500 Internal Server Error</h1>
      <p>Something went wrong and we couldn't display the proper error page.</p>
      ${process.env.NODE_ENV === 'development' ? `<pre>${error.stack}</pre>` : ''}
    `);
  }
}

module.exports = errorHandler;