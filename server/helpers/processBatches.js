const Batch = require("../model/batch");
const Upload = require("../model/batch");
const Customer = require("../model/customer");
const async = require("async");

// Function to process batches in parallel
exports.processBatchesInParallel = async (uploadId, batches, customers, io) => {
  let uploadedRecords = 0; // Initialize uploaded records counter

  // Create an array of functions to process each batch
  const batchProcessingFunctions = batches.map((batchId) => {
    return async () => {
      const batch = await Batch.findById(batchId);

      if (!batch) {
        throw new Error("Batch not found");
      }

      // Process batch
      const batchCustomers = customers.slice(
        batch.start_record_index,
        batch.end_record_index + 1
      );

      // Insert batchCustomers into the database
      await Customer.insertMany(batchCustomers);

      uploadedRecords += batchCustomers.length;

      // Emit progress update event
      io.emit("progressUpdate", {
        uploadId: uploadId,
        completedBatches: batch.batch_index,
        uploadedRecords: uploadedRecords,
        totalRecords: customers.length,
      });

      // Update batch status to completed
      batch.status = "completed";
      await batch.save();

      // Updating the count of the uploaded_records
      await Upload.findByIdAndUpdate(uploadId, {
        uploaded_records: uploadedRecords,
      });

      console.log(`#2024118182920298 Batch index ${batch.batch_index} Done`);
    };
  });

  // Execute batch processing functions in parallel
  await async.parallel(batchProcessingFunctions);
};
