const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,  // Assuming user_id is an ObjectId
    required: true,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,  // Assuming product_id is an ObjectId
    required: true,
  },
  customer_id: {
    type: String,  // Stripe customer ID
    required: true,
  },
  amount: {
    type: Number,  // Amount in smallest currency unit (e.g., cents)
    required: true,
  },
  type: {
    type: String,  // Type of transaction (e.g., 'content')
    required: true,
  },
  items_vat_amount:{
    type: Number,  // Amount of VAT on the items (e.g., 20%)
    required: false,
  },
  hopper_charge_ac_category:{
    type: Number,  // Amount of VAT on the items (e.g., 20%)
    required: false,
  },
  original_ask_price: {
    type: Number,  // Original price before offer or any changes
    required: true,
  },
  offer: {
    type: Boolean,  // Whether there is an offer involved
    default: false,
  },
  is_charity: {
    type: Boolean,  // Whether this is a charity transaction
    default: false,
  },
  description: {
    type: String,  // Description of the transaction or product
    required: true,
  },
  application_fee: {
    type: Number,  // Fee for the application/service (e.g., Stripe application fee)
    required: true,
  },
  stripe_account_id: {
    type: String,  // Stripe account ID for connected account
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('BulkTransaction', TransactionSchema);