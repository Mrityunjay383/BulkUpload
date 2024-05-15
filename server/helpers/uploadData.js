const Upload = require("../model/upload");
const Batch = require("../model/batch");
const Customer = require("../model/customer");

exports.uploadData = async (batches, customers, uploadId, io) => {
  let uploadedRecords = 0; // Initialize uploaded records counter

  const upload = await Upload.findOne({ _id: uploadId });

  for (let batchId of batches) {
    const batch = await Batch.findById(batchId);

    if (!batch) {
      throw new Error("Batch not found");
    }

    // Process batch
    const batchCustomers = customers[batch.batch_index];

    // Insert batchCustomers into the database
    await Customer.insertMany(batchCustomers);

    uploadedRecords += batchCustomers.length;

    // Update batch status to completed
    batch.status = "completed";
    await batch.save();

    //Updating the count of the uploaded_records
    upload.uploaded_records = uploadedRecords;
    await upload.save();

    //Emiting the progress upload to the user
    io.emit("UploadingProgress", {
      update: `Batch index ${batch.batch_index} is done`,
      uploadId,
      uploadedRecords,
    });

    console.log(`#2024118182920298 Batch index ${batch.batch_index} Done`);
  }
};
