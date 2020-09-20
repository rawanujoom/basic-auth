'use strict';
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET = 'mytokensecret';
const userScema = new mongoose.Schema({
    userName:{type:String,require:true},
    userPass:{type:String,require:true}
});
const userFunctions = {}

userFunctions.hashPass =  async function(record) {
    return{
        userName:record.username,
        userPass: await bcrypt.hash(record.password, 5)
    }
}
userFunctions.authenticateBasic = async function(username,password) {
    let userLogin = new User();
    let result = await userLogin.get({userName : username});
    console.log('>>>>>>>result',result);
    if(result.length > 0){
        let userPassword = password
        let hasedPass = result[0].userPass
        // console.log('>>>>>>>userPassword',record);
        let valid = await bcrypt.compare(userPassword,hasedPass)
        let returnValue = valid ? result : Promise.reject();
        return returnValue
    }else{
        return Promise.reject();
    }
}

userFunctions.generateToken = function(username){
    return jwt.sign({username: username},SECRET);
}

class User{
    constructor(){
        this.schema = mongoose.model('userScema',userScema);
    }
    async create(record){
        console.log('>>>>>>>>>>>>>>>dataRecord',record);
        let dataRecord = await userFunctions.hashPass(record)
        let newUser = new this.schema(dataRecord);
        return newUser.save();
    }
    get(query){
        // let obj = val ? { prop : val } : {};
        // console.log('>>>>>>>>>>OBJ',obj);
        return this.schema.find(query);
    }
    getByuserName(userName){
        let obj ={ userName };
        return this.schema.find(obj);
    }
    update(_id,record){
        return this.schema.findByIdAndUpdate(_id,record);
    }
    patch(_id,record){
        return this.schema.findByIdAndUpdate(_id,record);
    }
    delete(_id){
        return this.schema.findByIdAndDelete(_id)
    }
   

}
module.exports = {
    userFunctions : userFunctions,
    userModel : new User()
}
// module.exports = new User();
