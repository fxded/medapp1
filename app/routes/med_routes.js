// routes/med_routes.js
const User = require('../models/user');
const Doctor = require('../models/doctor');

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
                                email       : userData.email,
                                speciality  : userData.speciality};
            
            if (!item.speciality) {
                User.create(item, function (error, user) {
                    if (error) {
                        console.log('bd_error: ', error);
                        res.send(error);
                        res.end();
                    } else {
                        req.session.userId = user._id;
                        console.log('result of insert: ', user);
                        res.send(user);
                        res.end();
    //                    return res.redirect('/profile');
                    }
                });
            } else {
                Doctor.create(item, function (error, user) {
                    if (error) {
                        console.log('bd_error: ', error);
                        res.send(error);
                        res.end();
                    } else {
                        req.session.userId = user._id;
                        console.log('result of insert: ', user);
                        res.send(user);
                        res.end();
    //                    return res.redirect('/profile');
                    }
                });
            }
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
                if ((error) && !(error.status == 401)) {
                    var err = new Error('Something went wrong at userDB!');
                    err.status = 401;
                    console.log('------->error by userDB', error);
                } else if (error && error.status == 401) {
                    Doctor.authenticate(userData.email, userData.password, function (error, user) {
                        if ((error) && !(error.status == 401)) {
                            var err = new Error('Something went wrong at doctorDB!');
                            err.status = 401;
                            res.send({error:err, msg:"Something went wrong!"});
                            res.end();
                            console.log('------->error by doctorDB', error);
                        } else if (error && error.status == 401) {
                            var err = new Error('Wrong email or password.');
                            err.status = 401;
                            res.send({error:err, msg:"Wrong email or password."});
                            res.end();
                            console.log('------->error authenticate:', error);                         
                        } else {
                            console.log('------->finding doctors:', user);
                            req.session.userId = user._id;
                            res.send({data: 'finding is ok'
                                    , file: 'doctorProfile.html'});
                        }
                    });
                } else {
                    console.log('------->finding user11:', user);
                    req.session.userId = user._id;
                    res.send({data: 'finding is ok'
                            , file: 'patientProfile.html'});                }
            });
        });
        req.on('end', function(){
            console.log('end of requset');
        });
    });

    // GET route after registering
    app.get('/profilePatient', function (req, res, next) {
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
                    Doctor.find({ timeToWork: { $gt: []  } }
                                , { speciality: 1, username: 1, timeToWork: 1, _id: 1 }
                                , function (err, timeToWorkdata) {
                                        if (err) throw err;
                                        console.log("=====request from doctors:", timeToWorkdata);
                                        res.send({ head: '<h1>Name: ' + user.username + '</h1>' 
                                                 , sessionData: timeToWorkdata });
                                        res.end();
                    });
                    //res.render('index');
                }
            }
        });
    });
    // Get Doctors profile
    app.get('/profileDoctor', function (req, res, next) {
        Doctor.findById(req.session.userId).exec(function (error, user) {
            if (error) {
                    console.log('------->session is error:', error);
            } else {
                if (user === null) {
                var err = new Error('Not authorized! Go back!');
                err.status = 400;
                console.log('------->session is ended:', err);
                res.redirect('/');
                } else {
                    //res.sendfile('doctorProfile.html');
                    res.send({data: '<h1>Name: ' + user.username + 
                             '</h1> <h2>Mail: ' + user.email +
                             '</h2> <h2>Speciality: ' + user.speciality +
                             '</h2>'});
                    res.end();
                    //res.render('index');
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
    
    // POST to set reception time by doctors
    app.post('/setParameter', function (req, res) {
        req.on('data', function(data){
            console.log('setParameter: ', data.toString());
            const   userData = JSON.parse(data);
            Doctor.findOneAndUpdate({ _id: req.session.userId}, userData, {new: true}, 
                                      function(error, user) {
                if (error) {
                        console.log('------->setParameter is error:', error);
                } else {
                    if (user === null) {
                    var err = new Error('setParameter is issue');
                    err.status = 400;
                    console.log('------->setParameter is ended:', err);
                    res.send({error:err, msg:"setParameter is issue."});
                    } else {
                        res.send({data: user});
                        res.end();
                    }
                }
                                          
            });
        });
        req.on('end', function(){
            console.log('end of setParameter');
        });

         //console.log('setParameter', req);
    });

    // POST to select session 
    app.post('/selSession', function (req, res) {
        req.on('data', function(data){
            console.log('------selSession: ', data.toString());
            const   userData = JSON.parse(data);
/*            Doctor.findOneAndUpdate({ _id: req.session.userId}, userData, {new: true}, 
                                      function(error, user) {
                if (error) {
                        console.log('------->setParameter is error:', error);
                } else {
                    if (user === null) {
                    var err = new Error('setParameter is issue');
                    err.status = 400;
                    console.log('------->setParameter is ended:', err);
                    res.send({error:err, msg:"setParameter is issue."});
                    } else {
                        res.send({data: user});
                        res.end();
                    }
                }
                                          
            });*/
            res.send(data);
        });
        req.on('end', function(){
            console.log('end of setSession');
        });

         //console.log('setParameter', req);
    });

    
}
