const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();

app.use(cors());
app.use(express.json());

// LOG ALL REQUESTS (VERY IMPORTANT)
app.use((req, res, next) => {
    console.log(`➡️ ${req.method} ${req.url}`);
    next();
});

// ================= MONGO =================
const uri =
  "mongodb+srv://gmuriithiwamwangi_db_user:Nyand2k27Grvn@cluster0.ql0owo1.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

let db, lessonsCollection, ordersCollection;
let dbReady = false;

// CONNECT DB SAFELY
async function connectDB() {
    try {
        await client.connect();

        db = client.db("brighter_minds");
        lessonsCollection = db.collection("lessons");
        ordersCollection = db.collection("orders");

        dbReady = true;

        console.log("✅ MongoDB CONNECTED (brighter_minds)");
    } catch (err) {
        console.error("❌ DB CONNECTION ERROR:", err);
    }
}
connectDB();

// BLOCK REQUESTS UNTIL DB READY
function checkDB(req, res, next) {
    if (!dbReady) {
        return res.status(503).json({ error: "DB not ready yet" });
    }
    next();
}

// ================= ROUTES =================

// TEST
app.get("/test", (req, res) => {
    res.json({ message: "Backend working" });
});

// LESSONS
app.get("/lessons", checkDB, async (req, res) => {
    const lessons = await lessonsCollection.find().toArray();
    res.json(lessons);
});

// UPDATE SPACES
app.patch("/lessons/:id/spaces", checkDB, async (req, res) => {
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

// ================= ORDERS (FIXED CORE ISSUE) =================

app.post("/orders", checkDB, async (req, res) => {
    try {
        console.log("📦 ORDER BODY:", req.body);

        const { name, phone, cart } = req.body;

        if (!name || !phone || !Array.isArray(cart)) {
            return res.status(400).json({
                error: "Missing name, phone or cart is invalid"
            });
        }

        const order = {
            name,
            phone,
            items: cart.map(i => ({
                lessonId: i._id,
                subject: i.subject,
                price: i.price,
                quantity: i.quantity || 1
            })),
            total: cart.reduce(
                (sum, i) => sum + i.price * (i.quantity || 1),
                0
            ),
            createdAt: new Date()
        };

        const result = await ordersCollection.insertOne(order);

        console.log("✅ ORDER SAVED:", result.insertedId);

        res.json({
            success: true,
            orderId: result.insertedId
        });

    } catch (err) {
        console.error("❌ ORDER ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

// GET ORDERS
app.get("/orders", checkDB, async (req, res) => {
    const orders = await ordersCollection.find().toArray();
    res.json(orders);
});

// ================= START =================
const PORT = process.env.PORT || 3030;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
