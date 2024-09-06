// Imports
// Models Imports
const UserModel = require("../models/userModel"); // for getting user
const PaymentModel = require("../models/paymentModel");

// get Current user
const getCurrentUser = async (req, res) => {
    // Extract userId from the request
    const { userId } = req;

    console.log(userId);

    try {
        // Get the user by userId
        const user = await UserModel.findOne({ _id: userId });

        if (!user) {
            // Return 404 if user is not found
            return res.status(404).json({ NotFoundException: "User Not Found." });
        }

        // Return user data if found
        return res.status(200).json({ user });

    } catch (error) {
        // Log and return a 500 error if server fails
        console.error(error);
        return res.status(500).json({ Error: "Error fetching user." });
    }
}

const getPaymentData = async (req, res) => {
    // Assume req.userId is set by the authentication middleware
    const { userId } = req;

    try {
        // Fetch payments associated with the user ID
        const payments = await PaymentModel.findOne({ user_id: userId });

        if (!payments || payments.length === 0) {
            // If no payments are found, return a 404 error
            return res.status(404).json({ NotFoundException: "No payments found for this user." });
        }

        // Return the payment data
        return res.status(200).json({ payments });

    } catch (error) {
        // Return a 500 error in case of server failure
        return res.status(500).json({ Error: "Server Error." });
    }
};

const updatePaymentData = async (req, res) => {
    // Extract userId from the request
    const { userId } = req;
    // Extract payment data from request body
    const updateData = req.body;

    try {
        // Find the payment record by userId
        const payment = await PaymentModel.findOne({ user_id: userId });

        if (!payment) {
            // If the payment is not found, return a 404 error
            return res.status(404).json({ NotFoundException: "Payment Not Found." });
        }

        // Update the payment fields with the values from updateData
        Object.keys(updateData).forEach(key => {
            // Optionally, you can validate if the key is an allowed field
            if (payment[key] !== undefined) {
                payment[key] = updateData[key];
            }
        });

        // Save the updated payment record to the database
        await payment.save();

        // Return the updated payment data
        return res.status(200).json({ payment });

    } catch (error) {
        // Log and return a 500 error in case of server failure
        console.error(error);
        return res.status(500).json({ Error: "Error updating payment." });
    }
};

const updatePaymentFixed = async (req, res) => {
    // Extract userId from the request
    const { userId } = req;
    // Extract payment data from request body
    const { paymentMethod, userName } = req.body;

    try {
        // Find the payment record by userId
        const payment = await PaymentModel.findOne({ user_id: userId });

        if (!payment) {
            // If the payment is not found, return a 404 error
            return res.status(404).json({ NotFoundException: "Payment Not Found." });
        }

        // Update the payment fields if they are provided in the request body
        if (paymentMethod) {
            if (["credit_card", "paypal", "bank_transfer"].includes(paymentMethod)) {
                payment.paymentMethod = paymentMethod;
            } else {
                return res.status(400).json({ error: "Invalid payment method." });
            }
        }
        if (userName) payment.userName = userName;

        // Save the updated payment record to the database
        await payment.save();

        // Return the updated payment data
        return res.status(200).json({ payment });

    } catch (error) {
        // Log and return a 500 error in case of server failure
        console.error(error);
        return res.status(500).json({ Error: "Error updating payment." });
    }
};

module.exports = { getCurrentUser, getPaymentData, updatePaymentData, updatePaymentFixed }
