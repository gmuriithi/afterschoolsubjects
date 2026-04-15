const express = require("express");
const cors = require("cors");
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3030;

// ---------------- Middleware ----------------
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend")));

// ---------------- MongoDB ----------------
const uri = "mongodb+srv://gmuriithiwamwangi:Nyand2k27Grvn$$@cluster0.deepy.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri);

let lessonsCollection;
let ordersCollection;

// ---------------- CONNECT DB ----------------
async function connectDB() {
  try {
    await client.connect();
    const db = client.db("brighter_minds");

    lessonsCollection = db.collection("lessons");
    ordersCollection = db.collection("orders");

    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ DB Error:", err);
  }
}
connectDB();

// ---------------- LESSONS ----------------

// GET ALL LESSONS
app.get("/lessons", async (req, res) => {
  try {
    const lessons = await lessonsCollection.find().toArray();
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
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
    res.status(500).json({ message: err.message });
  }
});

// ---------------- ORDERS ----------------

// CREATE ORDER (THIS FIXES EVERYTHING)
app.post("/orders", async (req, res) => {
  try {
    const { name, phone, cart } = req.body;

    if (!name || !phone || !cart || cart.length === 0) {
      return res.status(400).json({ message: "Invalid order" });
    }

    const cleanCart = cart.map(item => ({
      lessonId: item._id,
      subject: item.subject,
      price: item.price
    }));

    const order = {
      name,
      phone,
      items: cleanCart,
      total: cleanCart.reduce((sum, i) => sum + i.price, 0),
      createdAt: new Date()
    };

    const result = await ordersCollection.insertOne(order);

    res.json({
      message: "Order saved successfully",
      orderId: result.insertedId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// GET ORDERS (CHECK DATABASE)
app.get("/orders", async (req, res) => {
  try {
    const orders = await ordersCollection.find().toArray();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------- FRONTEND ----------------
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// ---------------- START ----------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
