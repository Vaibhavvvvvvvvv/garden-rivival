const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const path = require("path");

// ✅ Import Models
const User = require("./models/User");
const GarbageCollection = require("./models/garbageModel"); // ✅ Keep only this one!

// ✅ Initialize Express App
const app = express();
const PORT = 3000;

// ✅ Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/auth_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Middleware setup
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ✅ Sessions
app.use(session({ 
    secret: "secretKey", 
    resave: false, 
    saveUninitialized: true 
}));

// ✅ Initialize Passport & Flash messages
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// ✅ Serve Static Files
app.use(express.static(path.join(__dirname, "public")));

// ✅ Passport Authentication Strategy
passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await User.findOne({ username });
        if (!user) return done(null, false, { message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return done(null, false, { message: "Incorrect password" });

        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

// ✅ API to Get Garbage Data
app.get("/api/garbage-data", async (req, res) => {
    try {
        const garbageData = await GarbageCollection.find();
        res.json(garbageData);
    } catch (error) {
        res.status(500).json({ message: "Error fetching data", error });
    }
});

// ✅ Authentication Routes
app.post("/signup", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ message: "All fields are required" });

        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });

        await newUser.save();
        res.redirect("/login.html");
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

app.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return res.status(500).json({ message: "Server error" });
        if (!user) return res.status(401).json({ message: info.message });

        req.login(user, (err) => {
            if (err) return res.status(500).json({ message: "Login failed" });
            res.redirect("/"); // ✅ Redirect to root
        });
    })(req, res, next);
});

// ✅ Logout Route
app.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.json({ message: "Logged out successfully" });
    });
});

// ✅ Check if user is authenticated
app.get("/check-auth", (req, res) => {
    res.json({ isAuthenticated: req.isAuthenticated() });
});

// ✅ Protect Routes
app.get("/live", (req, res) => {
    if (!req.isAuthenticated()) return res.redirect("/login.html");
    res.sendFile(path.join(__dirname, "public", "live.html"));
});

app.get("/report", (req, res) => {
    if (!req.isAuthenticated()) return res.redirect("/login.html");
    res.sendFile(path.join(__dirname, "public", "report.html"));
});

// ✅ Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
