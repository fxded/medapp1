// routes/index.js
const medRoutes = require('./med_routes');
module.exports = function (app) {
    medRoutes(app);
};
