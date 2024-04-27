const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema({
  file_name: String,
  total_records: Number,
  uploaded_records: Number,
  status: String,
  start_time: Date,
  end_time: Date,
});

module.exports = mongoose.model("Upload", uploadSchema);
