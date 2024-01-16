const mongoose = require("mongoose");

const DishSchema = new mongoose.Schema({
  dishName: {
    type: String,
    unique: true,
    required: true,
  },
  dishPrice: {
    type: Number,
    required: true,
  },
  availableQuantity: {
    type: Number,
    required: true,
  },
  dishType:{
    type: String,
    enum:['starter', 'maincourse','desert'],
    required: true,
  },
  servesPeople:{
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Dish", DishSchema);
