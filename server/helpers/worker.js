require("../config/database").connect();
const Batch = require("../model/batch");
const Upload = require("../model/upload");
const { parentPort, workerData } = require("worker_threads");
const Customer = require("../model/customer");

const process = async () => {
  console.time("DB Operation");

  let uploadedRecords = 0; // Initialize uploaded records counter

  const { batches, customers, uploadId } = workerData;

  const upload = await Upload.find({ _id: uploadId });

  for (let batchId of batches) {
    console.log(`#202413419362339 batchId`, batchId);

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

    // Update batch status to completed
    batch.status = "completed";
    await batch.save();

    //Updating the count of the uploaded_records
    upload.uploaded_records = uploadedRecords;

    console.log(`#2024118182920298 Batch index ${batch.batch_index} Done`);

    parentPort.postMessage({ done: false, uploadedRecords });
  }
  console.timeEnd("DB Operation");
};

process().then(() => {
  parentPort.postMessage({ done: true });
});
