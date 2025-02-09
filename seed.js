const mongoose = require("mongoose");
const GarbageCollection = require("./models/garbageModel"); // Import schema

// ✅ Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/auth_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ Fake Data Generation Function
const fakeGarbageData = [
    { garbage_type: "Plastic", weight_kg: 2.5, timestamp: new Date("2025-02-01T10:30:00Z") },
    { garbage_type: "Organic", weight_kg: 3.2, timestamp: new Date("2025-02-02T12:15:00Z") },
    { garbage_type: "E-Waste", weight_kg: 0.8, timestamp: new Date("2025-02-03T14:45:00Z") },
    { garbage_type: "Metal", weight_kg: 1.5, timestamp: new Date("2025-02-04T09:20:00Z") },
    { garbage_type: "Glass", weight_kg: 1.8, timestamp: new Date("2025-02-05T11:50:00Z") },
    { garbage_type: "Plastic", weight_kg: 2.1, timestamp: new Date("2025-02-06T16:10:00Z") },
    { garbage_type: "Organic", weight_kg: 3.5, timestamp: new Date("2025-02-07T13:40:00Z") },
    { garbage_type: "E-Waste", weight_kg: 0.6, timestamp: new Date("2025-02-08T08:30:00Z") },
    { garbage_type: "Metal", weight_kg: 1.2, timestamp: new Date("2025-02-08T15:20:00Z") },
    { garbage_type: "Glass", weight_kg: 2.0, timestamp: new Date("2025-02-09T18:00:00Z") }
];

// ✅ Insert Fake Data
const insertFakeData = async () => {
    try {
        await GarbageCollection.insertMany(fakeGarbageData);
        console.log("✅ Fake garbage data inserted successfully!");
        mongoose.connection.close(); // Close connection after insertion
    } catch (error) {
        console.error("❌ Error inserting data:", error);
    }
};

// ✅ Run the function
insertFakeData();
