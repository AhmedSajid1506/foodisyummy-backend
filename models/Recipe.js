const mongoose = require('mongoose');

const { Schema } = mongoose;

const RecipeSchema = new Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  title:{
    type: String,
    required: true
  },
  iframe:{
    type: String,
    required: true
  },
  directions:{
    type: String,
    required: true
  },
  ingredients:{
    type: String,
    required: true
  },
  thumbnail:{
    type: String,
    required: true
  },
  tags: [String, {required: true}],
  date:{
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('recipe', RecipeSchema);