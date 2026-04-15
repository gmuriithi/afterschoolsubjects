const express = require("express");
const cors = require("cors");
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3030;

// ---------------- FIXED CORS (IMPORTANT) ----------------
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend")));

// ---------------- DB ----------------
const uri = "mongodb+srv://gmuriithiwamwangi:Nyand2k27Grvn$$@cluster0.deepy.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri);

let lessonsCollection;
let ordersCollection;

async function connectDB() {
  await client.connect();
  const db = client.db("brighter_minds");

  lessonsCollection = db.collection("lessons");
  ordersCollection = db.collection("orders");

  console.log("✅ MongoDB Connected");
}
connectDB();

// ---------------- LESSONS ----------------
app.get("/lessons", async (req, res) => {
  const lessons = await lessonsCollection.find().toArray();
  res.json(lessons);
});

app.patch("/lessons/:id/spaces", async (req, res) => {
  const { change } = req.body;

  const result = await lessonsCollection.findOneAndUpdate(
    { _id: new ObjectId(req.params.id) },
    { $inc: { spaces: Number(change) } },
    { returnDocument: "after" }
  );

  res.json(result.value);
});

// ---------------- ORDERS ----------------
app.post("/orders", async (req, res) => {
  try {
    console.log("ORDER RECEIVED:", req.body);

    const { name, phone, cart } = req.body;

    if (!name || !phone || !cart || cart.length === 0) {
      return res.status(400).json({ message: "Invalid order" });
    }

    const order = {
      name,
      phone,
      items: cart.map(i => ({
        lessonId: i._id,
        subject: i.subject,
        price: i.price
      })),
      total: cart.reduce((s, i) => s + i.price, 0),
      createdAt: new Date()
    };

    const result = await ordersCollection.insertOne(order);

    res.json({
      message: "Order saved",
      orderId: result.insertedId
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ORDERS
app.get("/orders", async (req, res) => {
  const orders = await ordersCollection.find().toArray();
  res.json(orders);
});

// ---------------- FRONTEND ----------------
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
