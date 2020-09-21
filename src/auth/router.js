/* eslint-disable no-undef */
'use strict';

const users = require('./models/users-schema');

const basicAuth = require('./middleware/basicAuth')
const express = require('express');
const router = express.Router();

router.post('/signup', signUpHandler);
router.post('/signin',basicAuth, signInHandler);
router.get('/users',basicAuth, getAllUsers);

/**
 * this function respons the token to the user if it is not exist
 * @param {Object} req 
 * @param {Object} res 
 * @param {callBack} next 
 */
function signUpHandler(req,res) {
    // first check if the username exists then add it if not 
    let user = new users(req.body);
    // hash the password first
    user.save().then((user)=> {
        let token = users.generateToken(user.username);
        res.status(201).send(token);
    });
}

function signInHandler(req,res) {
    if(req.basicAuth) {
        // add the token as cookie 
        res.cookie('token', req.basicAuth.token);
        // add a header
        res.set('token', req.basicAuth.token);
        // send json object with token and user record
        res.status(200).json(req.basicAuth);
    } else {
        res.status(403).send("invaled login");
    }
}
function getAllUsers(req,res){
    if(req.basicAuth.token){
        users.find().then(result =>{
            res.status(200).json(result);
        })
    }else{
        res.status(403).send("invaled login");
    }
}
module.exports = router