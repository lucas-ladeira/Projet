const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please enter the name']
  },
  description: {
    type: String,
    required: [true, 'Please enter the description']
  },
  price: {
    type: Number,
    required: [true, 'Please enter the price']
  },
  image: {
    type: String,
    required: [true, 'Please enter the image']
  }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;