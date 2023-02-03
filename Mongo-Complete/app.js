const express = require('express');
const { ObjectId } = require('mongodb');
const { connectToDb, getDb } = require('./db');

//init app and middleware
const app = express();
app.use(express.json());

//db Connection
var db;
connectToDb((err) => {
    if(!err){
        app.listen(3000, function(){console.log("Listening to port 3000!!!")});
        db = getDb();
    }
})

//routes
app.get('/books', function(req, res){
    const page = req.query.p;
    const booksperPage = 3;
    var books = [];
    db.collection('books')
      .find()
      .sort({author : 1})
      .skip(page*booksperPage)
      .limit(booksperPage)
      .forEach(book => books.push(book))
      .then(function(){
        res.status(200).json(books);
      })
      .catch(function(err){
        res.status(500).json({error: "Could Not find any Document"});
      })
    // res.json({mssg: "Welcome to the api"});
});

app.get('/books/:id', function(req, res){
    if(ObjectId.isValid(req.params.id)){
        db.collection('books')
      .findOne({_id : ObjectId(req.params.id)})
      .then(function(doc){
        res.status(200).json(doc);
      })
      .catch(function(err){
        res.status(500).json({err : "Could not find the document"})
      });
    }else{
        res.status(500).json({error: "Not a valid document id"});
    } 
});

app.post('/books', function(req, res){
    const book = req.body;
    db.collection('books')
      .insertOne(book)
      .then(function(result){
        res.status(201).json(result);
      })
      .catch(function(err){
        res.status(500).json({error : "Could not create a new Document"});
      });
});

app.delete('/books/:id', function(req, res){
    if(ObjectId.isValid(req.params.id)){
        db.collection('books')
      .deleteOne({_id : ObjectId(req.params.id)})
      .then(function(result){
        res.status(200).json(result);
      })
      .catch(function(err){
        res.status(500).json({error : "Could not delete the document"});
      });
    }
    else{
        res.status(500).json({error: "Not a valid Doc ID"});
    }
});

app.patch('/books/:id', function(req, res){
    const updates = req.body;
    if(ObjectId.isValid(req.params.id)){
        db.collection('books')
      .updateOne({_id : ObjectId(req.params.id)}, {$set: updates})
      .then(function(result){
        res.status(200).json(result);
      })
      .catch(function(err){
        res.status(500).json({error : "Could not update the document"});
      });
    }
    else{
        res.status(500).json({error: "Not a valid Doc ID"});
    }
})