// server.js - Full-featured Lessons API + Static Frontend Support

const express = require("express");
const cors = require("cors");
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3030;

// ---------------- Middleware ----------------
app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, "frontend")));

// ---------------- MongoDB Connection ----------------
// Hardcode your Atlas URI here (replace <password> with real password)
const uri = "mongodb+srv://gmuriithiwamwangi:Nyand2k27Grvn$$@cluster0.deepy.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri);

let lessonsCollection;

async function connectDB() {
  try {
    await client.connect();
    const db = client.db("brighter_minds"); // match your seed.js DB name
    lessonsCollection = db.collection("lessons");
    console.log("✅ Connected to MongoDB Atlas!");
  } catch (err) {
    console.error("❌ MongoDB Error:", err);
    process.exit(1);
  }
}
connectDB();

// ---------------- CRUD ROUTES ----------------

// GET /lessons - supports search, sort, pagination
app.get("/lessons", async (req, res) => {
  try {
    const { search, sortBy, order = "asc", page = 1, limit = 50 } = req.query;

    let query = {};
    if (search) query.subject = { $regex: search, $options: "i" };

    const sortOptions = sortBy
      ? { [sortBy]: order === "desc" ? -1 : 1 }
      : {};

    const skip = (page - 1) * limit;

    const lessons = await lessonsCollection
      .find(query)
      .sort(sortOptions)
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .toArray();

    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /lessons/:id
app.get("/lessons/:id", async (req, res) => {
  try {
    const lesson = await lessonsCollection.findOne({
      _id: new ObjectId(req.params.id),
    });
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /lessons
app.post("/lessons", async (req, res) => {
  try {
    const result = await lessonsCollection.insertOne(req.body);
    res.json({ message: "Lesson created", id: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /lessons/:id
app.put("/lessons/:id", async (req, res) => {
  try {
    const result = await lessonsCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    if (result.matchedCount === 0)
      return res.status(404).json({ message: "Lesson not found" });
    res.json({ message: "Lesson updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /lessons/:id
app.delete("/lessons/:id", async (req, res) => {
  try {
    const result = await lessonsCollection.deleteOne({
      _id: new ObjectId(req.params.id),
    });
    if (result.deletedCount === 0)
      return res.status(404).json({ message: "Lesson not found" });
    res.json({ message: "Lesson deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /lessons/:id/spaces (increment/decrement spaces)
app.patch("/lessons/:id/spaces", async (req, res) => {
  try {
    const { change } = req.body;
    const result = await lessonsCollection.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $inc: { spaces: Number(change) } },
      { returnDocument: "after" }
    );
    if (!result.value)
      return res.status(404).json({ message: "Lesson not found" });
    res.json({ message: "Spaces updated", lesson: result.value });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// FILTER route - price range and location
app.get("/lessons/filter", async (req, res) => {
  try {
    const { minPrice, maxPrice, location, page = 1, limit = 20 } = req.query;
    const query = {};

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (location) {
      const locList = location.split(",").map((x) => x.trim());
      query.location = { $in: locList };
    }

    const skip = (page - 1) * limit;

    const lessons = await lessonsCollection
      .find(query)
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .toArray();

    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Count route
app.get("/lessons/count", async (req, res) => {
  try {
    const count = await lessonsCollection.countDocuments();
    res.json({ total: count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Serve index.html as homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// Catch-all fallback route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "trial.html"));
});

// ---------------- Start Server ----------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
