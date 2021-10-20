//Imports
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Schema
const userSchema = mongoose.Schema({
    email : {type: String, required: true, unique: true},
    password : {type: String, required: true}
});

//Unique validator, email unique dans bdd

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);