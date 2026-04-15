const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();

app.use(cors());
app.use(express.json());

// ================= MONGODB =================
const uri =
  "mongodb+srv://gmuriithiwamwangi_db_user:Nyand2k27Grvn@cluster0.ql0owo1.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

let db;
let lessonsCollection;
let ordersCollection;

// CONNECT DB (brighter_minds)
async function connectDB() {
  await client.connect();

  db = client.db("brighter_minds");

  lessonsCollection = db.collection("lessons");
  ordersCollection = db.collection("orders");

  console.log("✅ Connected to MongoDB (brighter_minds)");
}
connectDB();

// ================= LESSONS =================

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

// ================= ORDERS =================

// CREATE ORDER (FIXED & CLEAN)
app.post("/orders", async (req, res) => {
  try {
    const { name, phone, cart } = req.body;

    if (!name || !phone || !cart || cart.length === 0) {
      return res.status(400).json({ error: "Invalid order data" });
    }

    const order = {
      name,
      phone,
      items: cart.map((i) => ({
        lessonId: i._id,
        subject: i.subject,
        price: i.price,
        quantity: i.quantity || 1,
      })),
      total: cart.reduce(
        (sum, i) => sum + i.price * (i.quantity || 1),
        0
      ),
      createdAt: new Date(),
    };

    const result = await ordersCollection.insertOne(order);

    res.json({
      message: "✅ Order saved successfully",
      orderId: result.insertedId,
    });
  } catch (err) {
    console.error("Order error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET ORDERS (TEST)
app.get("/orders", async (req, res) => {
  const orders = await ordersCollection.find().toArray();
  res.json(orders);
});

// ================= START SERVER =================
const PORT = process.env.PORT || 3030;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
