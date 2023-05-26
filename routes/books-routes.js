const express = require('express')

//router instance for express
const router = express.Router()

//books --../ --go to parent root
let books = require('../data/books')

//books of model
let Book = require('../models/Book')
const { verifyAdmin } = require('../middlewares/auth')

//if it comes on / path
// router.route('/')
// .get((req,res)=>{
//     res.json(books)
// })
// .post((req,res)=>{
//     res.json(req.body)
// })
// .put()
// .delete()

router.route('/')
.get((req,res,next)=>{
    //both way are similar and promice approach and await
    
    Book.find()
    .then((books)=> res.json(books))
    .catch(next)
    
    
    
    // try{
    // const books = await Book.find()
    // res.json(books)
    // }catch(e){
    // console.log(e)
    // }
    })
    .post(verifyAdmin,(req,res,next)=>{
    Book.create(req.body)  //create new record on database
    .then((book)=>{
    res.status(201).json(book)  //if success then this
    
    })
    .catch(next)
})
    //put is not valid because we are not going to update all the books at a time.
    .put((req,res)=>{
        res.status(405).json({error: "method not allowed"}) //status code 405 -- never implement
    })
    .delete(verifyAdmin,(req,res)=>{
        Book.deleteMany()
        .then((result)=>{
            res.json(result)
        })
        .catch(err =>{
            console.log(err)
        })
    })

router.route('/:book_id')
    .get((req,res,next)=>{
        Book.findById(req.params.book_id)
        .then((book)=>{
            if(!book) return res.status(404).json({error: 'book not found'})
            res.json(book) //if sucess then return book
        }).catch(err => next(err)) 
    })
    .post((req,res) =>{
        res.status(405).json({error:"method not allowde"})
    })
    .put(verifyAdmin,(req,res,next) =>{
        //new data comes in req.body which is set to existing data
        Book.findByIdAndUpdate(
            req.params.book_id, //book id which  book that is id 1st parameter
            {$set: req.body}, //which data update 2nd parameter
            {new:true}  //returns the updated value 
            )
            //it is asynchronous function so .then and catch
            .then((updated)=> res.json(updated))
            .catch(next)
    })
    .delete(verifyAdmin,(req,res,next) => {
        Book.findByIdAndDelete(req.params.book_id)
        .then((reply) => {
        res.status(204).end()
    }).catch(next)
    })
//routes for book reviews
router.route('/:book_id/reviews')
.get((req,res,next)=>{
    Book.findById(req.params.book_id)
    .then((book) =>{
        if(!book) return res.status(404).json({error: 'book not found'})
        res.json(book.reviews)
    }).catch(next)
})
.post((req,res,next)=>{
    Book.findById(req.params.book_id)
    .then((book)=>{
        if(!book) return res.status(404).json({error: 'book not found'})
        const review = {
            text: req.body.text,
            //req.user from verify user and take id from there
            user: req.user.id
        }
        book.reviews.push(review)
        book.save()
        .then((book)=>res.status(201).json(book.reviews[book.reviews.length-1]))
        .catch(next)
    }).catch(next)
})
.put()
.delete(verifyAdmin,(req,res,next)=>{
    Book.findById(req.params.book_id)
    .then((book)=>{
        if(!book) return res.status(404).json({error: 'book not found'})
        book.reviews = []
        book.save()
        .then((book) => res.status(204).end())
        .catch(next)
    }).catch(next)
})
//
router.route('/:book_id/reviews/:review_id')
.get((req,res,next)=>{
    Book.findById(req.params.book_id)
    .then((book)=>{
        if(!book) return res.status(404).json({error: 'book not found'})
        const review = book.reviews.id(req.params.review_id)
        res.json(review)
    }).catch(next)
})
.put((req,res,next)=>{
    Book.findById(req.params.book_id)
    .then((book)=>{
        if(!book) return res.status(404).json({error: 'book not found'})
        let review = book.reviews.id(req.params.review_id)
        if(review.user != req.user.id){
            return res.status(403).json({error: 'You are not authorized'})
        }
        book.reviews = book.reviews.map((r) =>{
            if(r._id == req.params.review_id){
                r.text = req.body.text
            }
            return r        
        })
        book.save()
        .then(book =>{
            res.json(book.reviews.id(req.params.review_id))
        }).catch(next)
    }).catch(next)
})
.delete((req,res,next)=>{
    Book.findById(req.params.book_id)
    .then((book)=>{
        if(!book) return res.status(404).json({error: 'book not found'})
        book.reviews =book.reviews.filter((r)=> r._id != req.params.review_id) 
        book.save()
        .then(book=> res.status(204).end())
        .catch(next)
    }).catch(next)
})

//because everything is attached to router instance
module.exports = router