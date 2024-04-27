const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema({
  batch_index: Number,
  start_record_index: Number,
  end_record_index: Number,
  status: String,
  upload_id: { type: mongoose.Schema.Types.ObjectId, ref: "Upload" },
});

module.exports = mongoose.model("Batch", batchSchema);
