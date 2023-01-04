require("dotenv").config();
const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URL;

const connectToMongo = ()=>{
  mongoose.connect(mongoURI, ()=>{
    console.log("Connected to Mongo successfully");
  })
}

module.exports = connectToMongo;