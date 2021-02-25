const express = require('express');
const port = 3000;
const app = express();

// Allows you to use path params, body, and
// query string parameters
app.use(express.json());

// Import routes file, this is where
// the API logic will go
const cart = require('./cart');

// the routes module will serve
// the API from /my-routes
app.use('/', cart);

app.listen(port, () => {
  console.log(`Shopping Cart App listening at http://localhost:${port}`)
});