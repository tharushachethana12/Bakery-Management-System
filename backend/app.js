
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const userrouter = require("./Routes/UserRoutes");
const paymentrouter = require("./Routes/PaymentRoute");
const cakeRoute = require("./Routes/CakeRoute");

const app = express();

// Middleware
app.use(express.json());
app.use("/users",userrouter);
app.use("/cakes",cakeRoute);
app.use("/Payments",paymentrouter);

const mongoURL = process.env.MONGO_URI;

mongoose.connect(mongoURL)
.then(()=> console.log("connected to mongoDB"))
.then(()=> {
    app.listen(4000);
})
.catch((err) => console.log("Error connecting to MongoDB:", err));