const express = require('express');
const Category = require('../model/categories'); // Adjust the path if necessary
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
// Set up CORS
app.use(cors({
    origin: '*', // Allow all domains or restrict to your frontend's domain
    methods: ['GET', 'POST','PUT','DELETE', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type'], // Allowed headers
}));
app.options('*', cors()); // This handles preflight requests


// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// MongoDB connection
mongoose.connect("mongodb+srv://dev:devpatel1234@cluster0.pf0qwiv.mongodb.net")
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log('MongoDB connection error: ' + err));


// CREATE a new categories entry
app.post('/api/categories', async (req, res) => {
    try {
        const category = new Category(req.body);   // use model `Category`
        const savedCategory = await category.save();
        res.status(201).json(savedCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// READ all categories entries
app.get('/api/categories', async (req, res) => {
    try {
        await dbConnect();
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// READ a single categories entry by ID
app.get('/api/categories/:id', async (req, res) => {
    try {
        const categories = await categories.findById(req.params.id);
        if (!categories) return res.status(404).json({ message: 'categories not found' });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE a categories entry by ID
app.put('/api/categories/:id', async (req, res) => {
    try {
        const updatedcategories = await categories.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedcategories) return res.status(404).json({ message: 'categories not found' });
        res.status(200).json(updatedcategories);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE a categories entry by ID
app.delete("/api/categories", async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({ catid: req.body.catid });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// DELETE all categories entries (optional)
// app.delete('/api/categories', async (req, res) => {
//     try {
//         await categories.deleteMany({});
//         res.status(200).json({ message: 'All categoriess deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// Handle OPTIONS requests (CORS preflight)
app.options('*', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
});

// Set the port and start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
