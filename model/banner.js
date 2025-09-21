
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://deva:devpatel1234@cluster0.pf0qwiv.mongodb.net/")
.then(() => console.log('MongoDB Connected...'))
.catch((err) => console.log('MongoDB connection error: ' + err));


const categorySchema = new mongoose.Schema({
  image: { type: String, required: true},
}, { timestamps: true });


const banner = mongoose.model('banner', categorySchema,'banner');
module.exports = banner;