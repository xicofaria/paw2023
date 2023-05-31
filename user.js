var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    Age:{
        type: String,
        required: true
    },

  permission: { 
        type: Number, 
        required: true, 
        default: 2
    }, // 1 - Admin, 2 - User

});

module.exports = mongoose.model('User', userSchema);
