const mongoose = require("mongoose")

const UserModel = mongoose.Schema({
    FirstName:{type:String,required:true},
    LastName:{type:String,required:true},
    Email:{type:String,required:true,unique:true},
    Password:{type:String,required:true},
})

module.exports = mongoose.model('User',UserModel)