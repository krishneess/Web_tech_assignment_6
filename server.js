

const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require('express');
const app = express();
const connectDB = require('./config');
const Blog = require('./blogSchema');

app.use(express.json());

// Connect to MongoDB before handling API requests
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error("MongoDB connection failed:", err.message);
        res.status(503).json({
            message: "Database connection unavailable"
        });
    }
});

// CREATE a blog
app.post('/api/blogs', async (req, res) => {
    try {
        const blog = await Blog.create(req.body);
        res.status(201).json(blog);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// READ all blogs
app.get('/api/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// READ one blog by ID
app.get('/api/blogs/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.json(blog);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE a blog by ID
app.put('/api/blogs/:id', async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.json(blog);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE all blogs
app.delete('/api/blogs', async (req, res) => {
    try {
        await Blog.deleteMany();
        res.json({ message: 'All blogs deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE one blog by ID
app.delete('/api/blogs/:id', async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.json({
            message: 'Blog deleted successfully',
            deletedBlog: blog
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Start server after database connection
const PORT = process.env.PORT || 5000;

// Export the Express app for Vercel
module.exports = app;

// Start a local server when running on your computer
if (require.main === module) {
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}