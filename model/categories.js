
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://deva:devpatel1234@cluster0.pf0qwiv.mongodb.net/",{
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  keepAlive: true,
})
.then(() => console.log('MongoDB Connected...'))
.catch((err) => console.log('MongoDB connection error: ' + err));


const categorySchema = new mongoose.Schema({
  catid: { type: String, required: true, unique: true }, // e.g., "kurtis"
  name: { type: String, required: true, unique: true }, // e.g., "Kurtis"
  description: { type: String }, // optional
  image: { type: String }, // category banner
}, { timestamps: true });


const Category = mongoose.model('categories', categorySchema,'categories');
module.exports = Category;