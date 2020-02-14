// server.js
const   port        = process.env.PORT || 3004,
        dbName      = 'su2db',
        os          = require('os'),
        greeting    = require('./app/greeting'),
        bodyParser  = require('body-parser'),
        mongoose    = require('mongoose'),
        session     = require('express-session'),
        MongoStore  = require('connect-mongo')(session),
        express     = require('express'),
        db          = require('./config/db'),
        app         = express();
        
mongoose.connect(db.url, { useUnifiedTopology: true, dbName: dbName });
const dbase = mongoose.connection;
console.log("=====",dbase.client.s.url,'=====\n');        
app.use(express.static(__dirname + '/public'));

//use sessions for tracking logins
app.use(session({
  secret: 'iSDXHQ6CW87R9L930RCIQXCJWF',
  cookie: {maxAge: 90000},
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: dbase
  })
}));

// parse incoming requests
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));



dbase.on ('error', console.error.bind(console, 'connection error:'));
dbase.once('open', () => {
    require('./app/routes')(app);
    app.listen(port, () => {
        let userName = os.userInfo().username;
        console.log(`\n${greeting.date}`);
        console.log(greeting.getMessage(userName) + '! System is started on' , 
                    os.platform(), os.hostname(), os.release() + '. cpu count:',
                    os.cpus().length);
        console.log('Listen on ' + port + ' dir: ' + __dirname + 
                    ' dbase: ' +  dbName, '\n');
    });
});
// error handler
// define as the last app.use callback
/*app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found I\'m sorry');
  console.log('========File Not Found I\'m sorry===========');
  err.status = 404;
  next(err);
});
*/
process.on("SIGINT", () => {
    console.log('\ndb is closed'); 
    mongoose.disconnect();
    process.exit();
});
