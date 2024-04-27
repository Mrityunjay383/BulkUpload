const fs = require("fs");
const csvParser = require("csv-parser");
const Batch = require("../model/batch");

// Function to parse CSV file and create batches
exports.parseCSVAndCreateBatches = (filePath, uploadId, customers) => {
  return new Promise((resolve, reject) => {
    const batches = [];
    const batchSize = 1000;

    const stream = fs
      .createReadStream(filePath)
      .pipe(csvParser(["Name", "mobile-number"]));

    stream.on("data", async (row) => {
      // Save customer data to an array
      const newCustomer = {
        name: row["Name"],
        mobileNumber: row["mobile-number"],
        upload_id: uploadId,
        batchIndex: Math.floor(customers.length / batchSize) + 1,
      };
      customers.push(newCustomer);
    });

    stream.on("end", async () => {
      // Calculate total number of batches
      const totalBatches = Math.ceil(customers.length / batchSize);

      // Create batches
      for (let i = 0; i < totalBatches; i++) {
        const startRecordIndex = i * batchSize;
        const endRecordIndex = Math.min(
          (i + 1) * batchSize - 1,
          customers.length - 1
        );
        const newBatch = await Batch.create({
          batch_index: i,
          start_record_index: startRecordIndex,
          end_record_index: endRecordIndex,
          status: "pending",
          upload_id: uploadId,
        });
        batches.push(newBatch._id);
      }

      resolve(batches);
    });

    stream.on("error", (error) => {
      reject(error);
    });
  });
};
