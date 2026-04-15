const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 10000;

// ---------------- MIDDLEWARE ----------------
app.use(cors());
app.use(express.json());

// ---------------- MONGO DB ----------------
const uri = "mongodb+srv://gmuriithiwamwangi:Nyand2k27Grvn$$@cluster0.deepy.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

let db;
let lessonsCollection;
let ordersCollection;

// ---------------- CONNECT ----------------
async function connectDB() {
  try {
    await client.connect();

    db = client.db("brighter_minds");
    lessonsCollection = db.collection("lessons");
    ordersCollection = db.collection("orders");

    console.log("✅ Connected to MongoDB (brighter_minds)");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}
connectDB();

// ---------------- ROOT TEST ----------------
app.get("/", (req, res) => {
  res.send("🚀 API Running");
});

// ---------------- GET LESSONS ----------------
app.get("/lessons", async (req, res) => {
  try {
    const lessons = await lessonsCollection.find().toArray();
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- UPDATE SPACES ----------------
app.patch("/lessons/:id/spaces", async (req, res) => {
  try {
    const { change } = req.body;

    const result = await lessonsCollection.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $inc: { spaces: Number(change) } },
      { returnDocument: "after" }
    );

    res.json(result.value);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- CREATE ORDER (FIXED) ----------------
app.post("/orders", async (req, res) => {
  try {
    console.log("📥 ORDER RECEIVED:", req.body);

    const { name, phone, cart } = req.body;

    if (!name || !phone || !cart || cart.length === 0) {
      return res.status(400).json({ error: "Invalid order data" });
    }

    const order = {
      name,
      phone,
      items: cart.map(item => ({
        lessonId: item._id,
        subject: item.subject,
        price: item.price,
        quantity: item.quantity || 1
      })),
      total: cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0),
      createdAt: new Date()
    };

    const result = await ordersCollection.insertOne(order);

    console.log("✅ ORDER SAVED ID:", result.insertedId);

    res.json({
      success: true,
      orderId: result.insertedId
    });

  } catch (err) {
    console.error("❌ ORDER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------- GET ORDERS ----------------
app.get("/orders", async (req, res) => {
  try {
    const orders = await ordersCollection.find().toArray();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- START SERVER ----------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
