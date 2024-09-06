const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uuid = require("uuid").v4;

const paymentSchema = new Schema({
  _id: {
    type: String,
    required: true,
    default: uuid,
  },
  user_id: {
    type: String,
    required: false
  }, 
  userName: {
    type: String,
    required: false,
  },
  amount: {
    type: Number,
    required: false,
    min: 0
  },
  currency: {
    type: String,
    required: false,
    enum: ['USD', 'EUR', 'GBP'], // Specify acceptable currencies
    default: 'USD'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'paypal', 'bank_transfer'],
    required: false
  }
},
  { timestamps: true }
);


module.exports = mongoose.model("Payment", paymentSchema);