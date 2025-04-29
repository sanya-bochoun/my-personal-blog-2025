import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 4001;

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Hello TechUp!" });
});

// Simple in-memory storage
let posts = [];

// Get all posts
app.get("/posts", (req, res) => {
  res.json(posts);
});

// Create a new post
app.post("/posts", (req, res) => {
  try {
    const { title, content } = req.body;
    const newPost = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: new Date().toISOString()
    };
    posts.push(newPost);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a post by ID
app.get("/posts/:id", (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  
  if (!post) {
    return res.status(404).json({ error: "ไม่พบโพสต์ที่ต้องการ" });
  }

  res.json(post);
});

// Update a post
app.put("/posts/:id", (req, res) => {
  const { title, content } = req.body;
  const postIndex = posts.findIndex(p => p.id === req.params.id);

  if (postIndex === -1) {
    return res.status(404).json({ error: "ไม่พบโพสต์ที่ต้องการแก้ไข" });
  }

  posts[postIndex] = {
    ...posts[postIndex],
    title: title || posts[postIndex].title,
    content: content || posts[postIndex].content,
    updatedAt: new Date().toISOString()
  };

  res.json(posts[postIndex]);
});

// Delete a post
app.delete("/posts/:id", (req, res) => {
  const postIndex = posts.findIndex(p => p.id === req.params.id);

  if (postIndex === -1) {
    return res.status(404).json({ error: "ไม่พบโพสต์ที่ต้องการลบ" });
  }

  posts.splice(postIndex, 1);
  res.status(204).send();
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server is running at ${port}`);
  });
}

// Health check endpoint
app.get('/api/health', async (req, res) => {
  // สมมติคุณไม่มี DB เช็ค ก็ return ok อย่างง่าย
  res.json({ status: 'ok', timestamp: new Date() });
});

export default app; 