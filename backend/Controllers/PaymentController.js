//PaymentController.js
const Payment = require("../Model/PaymentModel");
const mongoose = require("mongoose");

//getpayments
const getAllPayments = async (req, res, next) => {
    try {
        const payments = await Payment.find();
        return res.status(200).json({ payments });
    } catch (err) {
        return res.status(500).json({ message: "Failed to fetch payments", error: err.message });
    }
};

//insertpayments
const addPayments = async (req, res, next) => {
    try {
        const { nameoncard, cardnumber, expirationdate, cvv, billingaddress, city, province, postalcode } = req.body;
        const payment = new Payment({ nameoncard, cardnumber, expirationdate, cvv, billingaddress, city, province, postalcode });
        const saved = await payment.save();
        return res.status(201).json({ payment: saved });
    } catch (err) {
        const status = err.name === "ValidationError" ? 400 : 500;
        return res.status(status).json({ message: "Failed to create payment", error: err.message });
    }
}

//update payment
const updatePayment = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        // Validate if ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid payment ID format" });
        }

        const { nameoncard, cardnumber, expirationdate, cvv, billingaddress, city, province, postalcode } = req.body;
        
        // Checking if payment exists and update
        const updatedPayment = await Payment.findByIdAndUpdate(
            id,
            { nameoncard, cardnumber, expirationdate, cvv, billingaddress, city, province, postalcode },
            { new: true, runValidators: true }
        );

        if (!updatedPayment) {
            return res.status(404).json({ message: "Payment not found" });
        }

        return res.status(200).json({ 
            message: "Payment updated successfully", 
            payment: updatedPayment 
        });
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({ message: "Validation error", error: err.message });
        }
        return res.status(500).json({ message: "Failed to update payment", error: err.message });
    }
}

//delete payment
const deletePayment = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        // Validate if ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid payment ID format" });
        }

        // Delete payment
        const deletedPayment = await Payment.findByIdAndDelete(id);

        if (!deletedPayment) {
            return res.status(404).json({ message: "Payment not found" });
        }

        return res.status(200).json({ 
            message: "Payment deleted successfully" 
        });
    } catch (err) {
        return res.status(500).json({ message: "Failed to delete payment", error: err.message });
    }
}

exports.getAllPayments = getAllPayments;
exports.addPayments = addPayments;
exports.updatePayment = updatePayment;
exports.deletePayment = deletePayment;