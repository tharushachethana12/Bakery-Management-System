require('dotenv').config(); 

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Add CORS for frontend communication

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", require("./Routes/UserRoutes"));
// app.use("/Payments", require("./Routes/PaymentRoute")); // Uncomment when ready

// Health check route
app.get("/api/health", (req, res) => {
    res.status(200).json({ 
        success: true,
        message: "Server is running successfully",
        timestamp: new Date().toISOString()
    });
});

// MongoDB connection
const mongoURL = process.env.MONGO_URI || "mongodb+srv://sahana2002:QhO31A3P9hnHysvq@cluster0.wptflp0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURL, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log("Connected to MongoDB"))
.then(() => {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch((err) => console.log("Error connecting to MongoDB:", err));