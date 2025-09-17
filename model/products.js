const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://deva:devpatel1234@cluster0.pf0qwiv.mongodb.net/")
.then(() => console.log('MongoDB Connected...'))
.catch((err) => console.log('MongoDB connection error: ' + err));

const productSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Floral Cotton Kurti"
  description: { type: String },
  price: { type: Number, required: true },
  size: [{ type: String }], // ["S", "M", "L", "XL"]
  color: [{ type: String }], // ["Red", "Blue"]
  stock: { type: Number, default: 0 },
  images: [{ type: String }], // product images
  categoryname: { 
    type: String, 
    required: true 
  }
}, { timestamps: true });


const Product = mongoose.model('products', productSchema,'products');
module.exports = Product;