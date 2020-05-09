var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var DoctorSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: false,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  speciality: {
    type: String,
    required: true,
  },
  timeToWork: {
      type: Array
  },
  temp: {
      type: String
  },
  appointment: {
    patient: { type: String },
    time: { type: String }
  }
});

//authenticate input against database
DoctorSchema.statics.authenticate = function (email, password, callback) {
  Doctor.findOne({ email: email })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err2 = new Error('Doctor not found.');
        err2.status = 401;
        return callback(err2);
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
            var err2 = new Error('Wrong Doctors password.');
            err2.status = 401;
            return callback(err2);
         }
      })
    });
}

//hashing a password before saving it to the database
DoctorSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});


var Doctor = mongoose.model('Doctor', DoctorSchema);
module.exports = Doctor;
