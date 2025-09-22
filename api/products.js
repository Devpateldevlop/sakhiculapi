const express = require('express');
const Product = require('../model/products'); // Adjust the path if necessary
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


// CREATE a new product entry
app.post('/api/product', async (req, res) => {
    try {
        const product = new Product(req.body);
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// READ all product entries
// app.get('/api/product', async (req, res) => {
//     try {
//         const products = await Product.find();
//         res.status(200).json(products);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });


// GET /api/product?categoryname=Kurti
// Or GET /api/product?categoryname=Kurti&size=M&color=Red
app.get('/api/product', async (req, res) => {
  try {
    await dbConnect();
    const filters = {};

    // add filters dynamically if provided
    if (req.query.categoryname) {
      filters.categoryname = req.query.categoryname;
    }
    if (req.query.size) {
      filters.size = req.query.size;
    }
    if (req.query.color) {
      filters.color = req.query.color;
    }

    const products = await Product.find(filters);
    res.status(200).json(products);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ a single product entry by ID
app.get('/api/product/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE a product entry by ID
app.put("/api/product", async (req, res) => {
  try {
    const { _id, ...updateData } = req.body; // extract _id and keep rest

    if (!_id) {
      return res.status(400).json({ message: "Product _id is required" });
    }

    const product = await Product.findByIdAndUpdate(_id, updateData, {
      new: true,           // return updated product
      runValidators: true  // apply schema validations
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product updated successfully", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// DELETE a product entry by ID
// app.delete('/api/product/:id', async (req, res) => {
//     try {
//         const deletedProduct = await Product.findByIdAndDelete(req.params.id);
//         if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
//         res.status(200).json({ message: 'Product deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// DELETE all product entries (optional)
// app.delete('/api/product', async (req, res) => {
//     try {
//         await Product.deleteMany({});
//         res.status(200).json({ message: 'All products deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

app.delete("/api/product", async (req, res) => {
  try {
    const { _id } = req.body;   // extract _id from request body

    if (!_id) {
      return res.status(400).json({ message: "Product _id is required" });
    }

    const product = await Product.findByIdAndDelete(_id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


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
