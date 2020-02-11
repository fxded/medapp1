// routes/note_routes.js

module.exports = function(app, db) {

    app.get('/', function(req,res){
        res.sendfile('index.html');
        res.end();
    });

};
