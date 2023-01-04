const connectToMongo = require('./db/db');
const express = require('express');
const cors = require('cors');
const path = require('path');

connectToMongo();
const app = express()
const PORT = process.env.port || 5000;

// Middleware
app.use(cors())
app.use(express.json())

// Available Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/recipe', require('./routes/recipe'));

app.use(express.static(path.join(__dirname, "./client/build")))

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
})

// if ( process.env.NODE_ENV == "production"){
//   app.use(express.static("client/build"));
// }

app.listen(PORT, () => {
  console.log(`FIYWEB listening on port ${PORT}`)
})