/* eslint-disable no-undef */
'use strict';
// const User = require('./models/users-model').userModel;
const users = require('../models/users-schema');
const base64 = require('base-64');
module.exports = (req,res,next)=>{

    if (!req.headers.authorization) {
        next('missing Headers!');
        return;
    }
    const auth = req.headers.authorization.split(' ');

    if(auth[0] == 'Basic') {
        const [username, password] = base64.decode(auth[1]).split(':'); 
        users.authenticateBasic(username, password).then(validUser =>{
            if (!validUser) {
                return next('Wrong Useranem or Password');
            }
            let token = users.generateToken(validUser.username);
            if(token){
                req.basicAuth = {
                    token : token,
                    user : validUser
                }
            }
            next();
            
        }).catch(err=> next(err));
    } else {
        next('Invalid Login!! ');
    }
}