const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        minLength: 6,
        unique: true
    },
    password:{
        type: String,
        required: true
        //every validation should be done before not here bcz it is hased--in frontend section
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    fullname: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user','admin'],
        default: 'user'
    }

})
module.exports = new mongoose.model('User',userSchema)