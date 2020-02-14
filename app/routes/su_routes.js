// routes/su_routes.js
const User = require('../models/user');


module.exports = function(app) {

    // GET route for reading data
    app.get('/', function(req,res){
        res.sendfile('index.html');
        res.end();
    });

    //POST route for updating data
    app.post('/signin', (req, res) => {
        req.on('data', function(data){
            console.log('requset: ', data.toString());
            const   userData = JSON.parse(data),
                    item = {    username    : userData.name, 
                                password    : userData.pass,
                                email       : userData.email};
                    
            User.create(item, function (error, user) {
                if (error) {
                    console.log('bd_error: ', error);
                } else {
                    req.session.userId = user._id;
                    console.log('result of insert: ', user);
                    res.send(user);
                    res.end();
//                    return res.redirect('/profile');
                }
            });
        });
        req.on('end', function(){
            console.log('end of requset');
        });
    });

    //POST route for login
    app.post ('/login', function(req,res){
        req.on('data', function(data){
            console.log('requset: ', data.toString());
            const   userData = JSON.parse(data);
                   
            User.authenticate(userData.email, userData.password, function (error, user) {
                if (error || !user) {
                    var err = new Error('Wrong email or password.');
                    err.status = 401;
                    console.log('------->error authenticate:', error);
                } else {
                    console.log('------->finding user:', user);
                    req.session.userId = user._id;
                    res.redirect('/profile');
                }
            });
        });
        req.on('end', function(){
            console.log('end of requset');
        });
    });

    // GET route after registering
    app.get('/profile', function (req, res, next) {
        User.findById(req.session.userId).exec(function (error, user) {
            if (error) {
                    console.log('------->session is error:', error);
            } else {
                if (user === null) {
                var err = new Error('Not authorized! Go back!');
                err.status = 400;
                console.log('------->session is ended:', err);
                res.redirect('/');
                } else {
                    res.send('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>')
                }
            }
        });
    });

    // GET for logout logout
    app.get('/logout', function (req, res, next) {
        if (req.session) {
            // delete session object
            req.session.destroy(function (err) {
            if (err) {
                console.log('------->error of destroing session:', err);
            } else {
                console.log('------->session destroyed:');
                res.redirect('/');
            }
            });
        }
    });

}    
/*
router.post('/', function (req, res, next) {
  // confirm that user typed same password twice
    console.log('---------',req);
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }

  if (req.body.email &&
    req.body.username &&
    req.body.password &&
    req.body.passwordConf) {

    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    }

    User.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });

  } else if (req.body.logemail && req.body.logpassword) {
    User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
})

// GET route after registering
router.get('/profile', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
          return res.send('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>')
        }
      }
    });
});

// GET for logout logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});
*/
