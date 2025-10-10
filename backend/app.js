require('dotenv').config(); 

const express = require("express");
const mongoose = require("mongoose");
const userrouter = require("./Routes/UserRoutes");
const paymentrouter = require("./Routes/PaymentRoute");
const cakeRoute = require("./Routes/CakeRoute");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/users",userrouter);
app.use("/cakes",cakeRoute);
app.use("/Payments",paymentrouter);

const mongoURL = process.env.MONGO_URI;

mongoose.connect("mongodb+srv://sahana2002:QhO31A3P9hnHysvq@cluster0.wptflp0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> console.log("connected to mongoDB"))
.then(()=> {
    app.listen(4000);
})
.catch((err) => console.log("Error connecting to MongoDB:", err));