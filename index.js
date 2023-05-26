require('dotenv').config()
//import express
const express = require('express')

//import mongoose
const mongoose = require('mongoose')

const books_routes = require('./routes/books-routes')
const users_routes = require('./routes/users-routes')
const {verifyUser} = require('./middlewares/auth')
const upload = require('./middlewares/upload')

//creating instance of express class
const app  = express()

//connect to database
//then and catch to if connected or not--.then success and .catch --failure 
mongoose.connect('mongodb://127.0.0.1:27017/c30-b')
.then(()=> console.log('Connected to mongodb server'))
.catch((err) => console.log(err))


//if we need many data json so we need to use this---
//it convert and useful for post method as it convert json 
//json data is decoded using this. 
app.use(express.json())
app.use(express.static('public')) // to show image to user

//to work and send data and response route is made. routes are middlewear--as comes 
//between response and request
//to handle get request--route of request 
app.get('/',(req, res)=>{
    res.send("Hello world")
})

//if any middle weare use then app.use() is used
//if /books come request any type then -- it send to books_routes for every /books path
// app.use(verifyUser)
app.use('/users',users_routes)
app.use('/books',verifyUser, books_routes)

app.post('/images', upload.single('photo'), (req,res)=>{
    res.json(req.file)
})



//Error handling middlewear
app.use((err,req,res,next) =>{
    console.error(err)
    if(err.name === 'CastError'){
        res.status(400)
    } else if(err.name ==='ValidationError'){
        res.status(405)
    }
    res.json({error: err.message})
})

//unknown path handling middlewear -- other than next error or other error --error occur on any path
//if in any path error occurs --it should be at last
app.use((req,res)=>{
    res.status(404).json({error: "path not found"})

})

//to listen app app default port --start on port 3000
app.listen(3001, ()=> {
    console.log('Server is running on port 3001 : http://localhost:3001')
})