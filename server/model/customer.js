const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: String,
  mobileNumber: String,
  upload_id: String,
});

module.exports = mongoose.model("Customer", customerSchema);
