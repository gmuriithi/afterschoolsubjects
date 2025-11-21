const { MongoClient } = require('mongodb');

// Put your Atlas URL here directly:
const uri = "mongodb+srv://gmuriithiwamwangi:Nyand2k27Grvn$$@cluster0.deepy.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri);

const lessons = [  
    
      { id: 1, subject: "Robotics", location: "Kigali", price: 150, spaces: 500, icon: "fa-robot", image: "data:image/jpeg;base64,/9j/4AAQSk..." },
      { id: 2, subject: "Chess Basics", location: "Abuja", price: 75, spaces: 5, icon: "fa-chess", image: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Chess_pieces_close_up.jpg" },
      { id: 3, subject: "Photography", location: "Addis Ababa", price: 95, spaces: 5, icon: "fa-camera-retro", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnZhMJEkwzHTk7JEGHRgTWQro5R3RvejXiNA&s" },
      { id: 4, subject: "Entrepreneurship", location: "Dakar", price: 130, spaces: 5, icon: "fa-briefcase", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUGZDl1JvFz8jXnSSfaQq85MkKbsGMNCLw2w&s" },
      { id: 5, subject: "Dance", location: "Kampala", price: 85, spaces: 5, icon: "fa-music", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeF4kcjuvu3Y8MtyL2EK5YP_ZXgY-z0HNhGQ&s" },
      { id: 6, subject: "Creative Writing", location: "Gaborone", price: 70, spaces: 5, icon: "fa-pen-nib", image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg..." },
      { id: 7, subject: "Coding", location: "Nairobi", price: 120, spaces: 5, icon: "fa-code", image: "data:image/jpeg;base64,C32pOYUM16DLpEf..." },
      { id: 8, subject: "Chess", location: "Abuja", price: 75, spaces: 5, icon: "fa-chess", image: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Chess_pieces_close_up.jpg" },
      { id: 9, subject: "Photography", location: "Addis Ababa", price: 95, spaces: 5, icon: "fa-camera-retro", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnZhMJEkwzHTk7JEGHRgTWQro5R3RvejXiNA&s" },
      { id: 10, subject: "Entrepreneurship", location: "Dakar", price: 130, spaces: 5, icon: "fa-briefcase", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUGZDl1JvFz8jXnSSfaQq85MkKbsGMNCLw2w&s" },
      { id: 11, subject: "Public Speaking", location: "Dar es Salaam", price: 100, spaces: 5, icon: "fa-bullhorn", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFv05-msXtzuun4o346sGVQ8aDkqLR-aDtxQ&s" },
      { id: 12, subject: "Gardening", location: "Bamako", price: 50, spaces: 5, icon: "fa-seedling", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa1JztIAlIRyIOhD86LGChZ5FI6dIe9Z_3og&s" },
      { id: 13, subject: "Cooking", location: "Lusaka", price: 80, spaces: 5, icon: "fa-utensils", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCdaOqw0hTgtHK5m0Z47afhJDyvw49f3623w&s" },
      { id: 14, subject: "Fashion Design", location: "Maputo", price: 110, spaces: 5, icon: "fa-scissors", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZbpSdmKupR6yV1Udh7jnAlNL0KIOopZAjzA&s" },
      { id: 15, subject: "Animal Care", location: "Monrovia", price: 70, spaces: 5, icon: "fa-paw", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyoUj8ct1sFr5794C8uUk6IqOdmJJCSs0hjA&s" },
      { id: 16, subject: "Yoga", location: "Nouakchott", price: 65, spaces: 5, icon: "fa-child", image: "https://spa-accor.imgix.net/.../278A9844-scaled.jpg" },
      { id: 17, subject: "Crafts", location: "Freetown", price: 60, spaces: 5, icon: "fa-tools", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTy0zbmKpr38phxHrJkjl38XvV-tkocMO_P5w&s" },
      { id: 18, subject: "Science", location: "Port Harcourt", price: 140, spaces: 5, icon: "fa-flask", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVm98afaV2stCTpvd9nbz8CY0cpp4SV6BMvA&s" },
      { id: 19, subject: "Music", location: "Johannesburg", price: 100, spaces: 5, icon: "fa-guitar", image: "https://cdn-icons-png.flaticon.com/512/2255/2255127.png" },
      { id: 20, subject: "First Aid", location: "Kano", price: 95, spaces: 5, icon: "fa-kit-medical", image: "https://cdn-icons-png.flaticon.com/512/484/484167.png" },
      { id: 21, subject: "3D Printing", location: "Zanzibar", price: 145, spaces: 5, icon: "fa-cube", image: "https://cdn-icons-png.flaticon.com/512/3616/3616755.png" },
      { id: 22, subject: "Mobile App Dev", location: "Kigali", price: 150, spaces: 5, icon: "fa-mobile-screen-button", image: "https://cdn-icons-png.flaticon.com/512/888/888879.png" },
      { id: 23, subject: "Football", location: "Juba", price: 90, spaces: 5, icon: "fa-futbol", image: "https://cdn-icons-png.flaticon.com/512/861/861512.png" },
      { id: 24, subject: "Painting", location: "Ouagadougou", price: 70, spaces: 5, icon: "fa-paintbrush", image: "https://cdn-icons-png.flaticon.com/512/2232/2232688.png" },
      { id: 25, subject: "Sculpting", location: "Bujumbura", price: 75, spaces: 5, icon: "fa-drafting-compass", image: "https://cdn-icons-png.flaticon.com/512/3616/3616755.png" }
    
]

async function seedDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    const db = client.db("brighter_minds"); // your DB name
    const collection = db.collection("lessons"); // your collection name

    await collection.deleteMany({});
    console.log("Cleared existing lessons");

    const result = await collection.insertMany(lessons);
    console.log(`Inserted ${result.insertedCount} lessons successfully!`);
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.close();
    console.log("Disconnected from MongoDB Atlas");
  }
}

seedDB();
