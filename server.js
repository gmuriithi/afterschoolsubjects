const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB
const uri = "mongodb+srv://gmuriithiwamwangi:Nyand2k27Grvn$$@cluster0.deepy.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

let db, lessonsCollection, ordersCollection;

// CONNECT DB
async function connectDB() {
  try {
    await client.connect();
    db = client.db("brighter_minds");

    lessonsCollection = db.collection("lessons");
    ordersCollection = db.collection("orders");

    console.log("✅ MongoDB Connected (brighter_minds)");
  } catch (err) {
    console.error("❌ MongoDB Error:", err);
  }
}

connectDB();

// ---------------- LESSONS ----------------

// GET ALL LESSONS
app.get("/lessons", async (req, res) => {
  const lessons = await lessonsCollection.find().toArray();
  res.json(lessons);
});

// UPDATE SPACES
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

// ---------------- ORDERS ----------------

// SAVE ORDER (FIXED)
app.post("/orders", async (req, res) => {
  try {
    const { name, phone, cart } = req.body;

    // validation
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

    res.json({
      message: "Order saved successfully",
      orderId: result.insertedId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET ORDERS (TEST)
app.get("/orders", async (req, res) => {
  const orders = await ordersCollection.find().toArray();
  res.json(orders);
});

// ---------------- START ----------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
