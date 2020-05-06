// server.js
const   port        = process.env.PORT || 3007,
        dbName      = 'meddb',
        os          = require('os'),
        greeting    = require('./app/greeting'),
        bodyParser  = require('body-parser'),
        mongoose    = require('mongoose'),
        session     = require('express-session'),
        MongoStore  = require('connect-mongo')(session),
        express     = require('express'),
        db          = require('./config/db'),
        app         = express();
        
mongoose.connect(db.url, { useUnifiedTopology: true
                         , useNewUrlParser: true
                         , dbName: dbName
                         , useFindAndModify: false 
});
const dbase = mongoose.connection;
console.log("=====",dbase.client.s.url,'=====\n');        
app.use(express.static(__dirname + '/public'));

//use sessions for tracking logins
app.use(session({
  secret: 'iSDXHQ6CW87R9L930RCIQXCJWF',
  cookie: {maxAge: 9000000},
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: dbase
  })
}));

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

process.on("SIGINT", () => {
    console.log('\ndb is closed'); 
    mongoose.disconnect();
    process.exit();
});
