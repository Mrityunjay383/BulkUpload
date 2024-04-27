const Batch = require("../model/batch");
const Customer = require("../model/customer");
const async = require("async");

// Function to process batches in parallel
exports.processBatchesInParallel = async (uploadId, batches, customers, io) => {
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

      // Simulate batch processing (replace with actual processing logic)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Insert batchCustomers into the database
      await Customer.insertMany(batchCustomers);

      // Update batch status to completed
      batch.status = "completed";
      await batch.save();

      // Emit progress update event
      const uploadedCount = await Customer.countDocuments({
        upload_id: uploadId,
      });
      io.emit("progressUpdate", {
        uploadId: uploadId,
        completedBatches: batches.filter((b) => b.status === "completed")
          .length,
        totalBatches: batches.length,
        uploadedRecords: uploadedCount,
        totalRecords: customers.length,
      });
    };
  });

  // Execute batch processing functions in parallel
  await async.parallel(batchProcessingFunctions);
};
