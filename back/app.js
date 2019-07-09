const express = require('express');
const routes = require('./routes/index');
var fileUpload = require('express-fileupload');
require('./handlers/passport');
// create our Express app
const app = express();
// const apiUrl = '';
const apiUrl = '';

app.use(fileUpload());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
//  res.header("Access-Control-Max-Age", "60");
//  res.header("Access-Control-Allow-Credentials", "true");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});


// After allllll that above middleware, we finally handle our own routes!
if (apiUrl) {
  app.use('/_api', routes);
} else {
  app.use('/', routes);
}


// done! we export it so we can start the site in start.js
module.exports = app;
