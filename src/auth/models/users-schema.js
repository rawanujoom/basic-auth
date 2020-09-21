/* eslint-disable no-undef */
'use strict';
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET = 'mytokensecret';

const userScema = new mongoose.Schema({
    username:{type:String,require:true},
    password:{type:String,require:true}
});

// hooks 
// right before the save , has the password
userScema.pre('save', async function() {
    this.password = await bcrypt.hash(this.password, 5);
});

//add methods to schema 
// users.methods > will add methods on the schema  
userScema.methods.comparePasswords = async function(password) {
    const valid = await bcrypt.compare(password, this.password);
    return valid ? this : null;
}

// add static methods
//users.statics > add static methods on the schema
userScema.statics.generateToken = function(username) {
    return jwt.sign({username: username},SECRET);
}

userScema.statics.authenticateBasic = async function(username,password) {
    let result = await this.findOne({username: username});
    if(result) {
        let compareResult = await result.comparePasswords(password);
        return compareResult;
    } else {
        return null;
    }
}

module.exports = mongoose.model('users', userScema);