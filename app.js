const express = require("express");
const router = require("./router");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require('body-parser');
const {MongoClient}= require('mongodb');
//const punycode = require('punycode');

const PORT = 5500;
const app = express(); 
const password=
// mongodb+srv://srushti:<password>@cluster0.wkmpjho.mongodb.net/?retryWrites=true&w=majority
 mongoose
  .connect('mongodb+srv://srushti:Srushti27@cluster0.wkmpjho.mongodb.net/?retryWrites=true&w=majority',{
    useNewUrlParser: true, useUnifiedTopology: true,
  })
  .then(()=>{
     console.log("Connected to MongoDB");
  })
  .catch((err)=>{
    console.log(err);
  });

app.use(bodyParser.json());
app.use('/', router);
app.use(cors());
app.use(express.json());
app.use(router);
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  req.url = req.url.toLowerCase();
  next();
});



module.exports=app;