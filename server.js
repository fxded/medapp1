// server.js
const   port        = process.env.PORT || 3004,
        express     = require('express'),

app = express();
        
app.use(express.static(__dirname + '/public'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found I\'m sorry');
  console.log('========File Not Found I\'m sorry===========');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

require('./app/routes')(app, {});

app.listen(port, () => {
    console.log('Listen on ' + port + ' dir ' + __dirname);
});
