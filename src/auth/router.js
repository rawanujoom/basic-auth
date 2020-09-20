'use strict';
const User = require('./models/users-model').userModel;
const UserFunctions = require('./models/users-model').userFunctions;
const basicAuth = require('./middleware/basicAuth')
const express = require('express');
const router = express.Router();

router.post('/signup',signUpHandler);
router.post('/signin',basicAuth,signInHandler);
router.post('/users',basicAuth,getAllUsers);

/**
 * this function respons the token to the user if it is not exist
 * @param {Object} req 
 * @param {Object} res 
 * @param {callBack} next 
 */
function signUpHandler(req,res) {
        // console.log('>>>>Result)',req.body);
        User.get({userName : req.body.username}).then(result =>{
        // console.log('>>>>Result)',result);
        if(result.length > 0){
            res.status(403).send('this user name already has as account');
        }else{
            User.create(req.body).then(result =>{
                res.status(200).json(UserFunctions.generateToken(result.username));
            }).catch(err =>{
                console.log(err);
                res.status(403).send("error !!");
            })
        }
    });
}

function signInHandler(req,res) {
    if(req.basicAuth){
        res.status(200).json(req.basicAuth);
    }else{
        res.status(403).send("invaled login");
    }
}
function getAllUsers(req,res){
    if(req.basicAuth.token){
        User.get().then(result =>{
            res.status(200).json(result);
        })
    }else{
        res.status(403).send("invaled login");
    }
}
module.exports = router