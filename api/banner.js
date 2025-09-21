const express = require('express');
const banner = require('../model/banner'); // Adjust the path if necessary
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


// CREATE a new banner entry
app.post('/api/banner', async (req, res) => {
    try {
        const banner = new banner(req.body);   // use model `banner`
        const savedbanner = await banner.save();
        res.status(201).json(savedbanner);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// READ all banner entries
app.get('/api/banner', async (req, res) => {
    try {
        
        const banner = await banner.find();
        res.status(200).json(banner);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// READ a single banner entry by ID
app.get('/api/banner/:id', async (req, res) => {
    try {
        const banner = await banner.findById(req.params.id);
        if (!banner) return res.status(404).json({ message: 'banner not found' });
        res.status(200).json(banner);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE a banner entry by ID
app.put('/api/banner/:id', async (req, res) => {
    try {
        const updatedbanner = await banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedbanner) return res.status(404).json({ message: 'banner not found' });
        res.status(200).json(updatedbanner);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE a banner entry by ID
app.delete("/api/banner", async (req, res) => {
  try {
    const banner = await banner.findOneAndDelete({ catid: req.body.catid });

    if (!banner) {
      return res.status(404).json({ message: "banner not found" });
    }

    res.json({ message: "banner deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// DELETE all banner entries (optional)
// app.delete('/api/banner', async (req, res) => {
//     try {
//         await banner.deleteMany({});
//         res.status(200).json({ message: 'All banners deleted successfully' });
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
