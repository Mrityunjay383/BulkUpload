const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: String,
  mobileNumber: String,
  upload_id: { type: mongoose.Schema.Types.ObjectId, ref: "Upload" },
  batchIndex: Number,
});

module.exports = mongoose.model("Customer", customerSchema);
