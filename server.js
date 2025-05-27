const express = require('express');
const session = require('express-session');
const flash = require('express-flash');
const static = require('./routes/static'); // Adjust the path as necessary
const baseController = require('./controllers/baseController'); // Adjust the path as necessary
const app = express();

const utilities = require("./utilities")

const errorHandler = require('./middleware/errorHandler');

// After all other middleware and routes
app.use(errorHandler);

const errorRouter = require('./routes/errorRoute');
app.use('/', errorRouter);


// Session configuration (REQUIRED for flash messages)
app.use(session({
  secret: 'your-secret-key-here', // Change this to a random string
  resave: false,
  saveUninitialized: true
}));

app.use(static)

// Flash middleware (must come after session)
app.use(flash());

// Make flash messages available to all templates
app.use((req, res, next) => {
  res.locals.messages = req.flash(); // This creates the messages() function
  next();
});

// Set up EJS view engine
app.set('view engine', 'ejs');
app.set('views', './views'); // Ensure this path is correct

// Your route
app.get("/", async function(req, res){

  
    const nav = await utilities.getNav()
    
     res.render("layouts/layout", {title: "Home", nav})

    
});

app.use('/inv/type', require('./routes/inventoryRoute')); // Adjust the path as necessary



// Start server
const PORT = 5500;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

