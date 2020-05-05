const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    firstName: {type:String, trim:true},
    middleName: {type:String, trim:true},
    lastName: {type:String, trim:true},
    password: {type:String, trim:true},
    address: {type:String},
    pincode: {type:Number, trim:true, match:/[0-9]/},
    age: {type:Number, trim:true, match:/[0-9]/},
    phoneNumber: {type:Number, trim:true, unique:true, match:/[0-9]/},
    emailId: {type:String, trim:true, unique:true, match:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/},
})

module.exports = mongoose.model('User', UserSchema)
