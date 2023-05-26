
//import mongoose
const mongoose = require('mongoose')

//review schema which is embedded in bookSchema
const reviewSchema = new mongoose.Schema({
    text: {
        type: String,
        require: true,
        //custom error message
        minLength: [10, 'review should be longer than 10 characters']
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        //reference user model --it contains of user type id from User model 
        ref: 'User'
    }

})

//define schema
const bookSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true //if required
    },
    author: {
        type: String,
        default: 'Anonymous'
    },
    //embede --list of reviews
    reviews: [reviewSchema]
    
})
//for users


//export --model name Book and module is made on bookSchema schema
//it export module not schema -- module contains schema
//we dont directly use schema --we use model which wrap schema
module.exports = mongoose.model('Book',bookSchema)

