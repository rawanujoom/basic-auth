'use strict';
// const User = require('./models/users-model').userModel;
const UserFunctions = require('../models/users-model').userFunctions;
const base64 = require('base-64');
module.exports = (req,res,next)=>{
    const auth = req.headers.authorization.split(' ');
    if(auth[0] == 'Basic') {
        const [username, password] = base64.decode(auth[1]).split(':'); 
        UserFunctions.authenticateBasic(username, password).then(validUser=>{
            let token = UserFunctions.generateToken(validUser[0].userName);
            console.log('>>>>>>>>>>token',token);
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
    // next();
}