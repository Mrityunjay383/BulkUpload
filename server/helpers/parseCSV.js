const { Worker } = require("worker_threads");
const Batch = require("../model/batch");

// Function to parse CSV file and create batches
exports.parseCSVAndCreateBatches = (filePath, uploadId) => {
  return new Promise((resolve) => {
    const batches = [];
    const batchSize = process.env.BATCH_SIZE;

    const worker = new Worker("./helpers/worker.js", {
      workerData: {
        filePath,
        uploadId,
      },
    });

    worker.on("message", async ({ customers, countIdx }) => {
      // Calculate total number of batches
      const totalBatches = Object.keys(customers).length;

      // Create batches
      for (let i = 0; i < totalBatches; i++) {
        const startRecordIndex = i * batchSize;
        const endRecordIndex = Math.min(
          (i + 1) * batchSize - 1,
          i * batchSize + customers[i].length
        );
        const newBatch = await Batch.create({
          batch_index: i,
          start_record_index: startRecordIndex,
          end_record_index: endRecordIndex,
          status: "pending",
          upload_id: uploadId,
        });
        batches.push(newBatch._id.toString());
      }

      resolve({ batches, customers, countIdx });
    });
  });
};
