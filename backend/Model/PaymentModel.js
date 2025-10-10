//PaymentModel.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    nameoncard:{
        type:String,
        required:true,
    },
    cardnumber:{
        type:Number,
        required:true,
    },
    expirationdate:{
        type:String,
        required:true,
    },
    cvv:{
        type:Number,
        required:true,
    },
    billingaddress:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    province:{
        type:String,
        required:true,
    },
    postalcode:{
        type:Number,
        required:true,
    }
});

module.exports = mongoose.model(
    "PaymentModel",
    paymentSchema
)