const { parentPort, workerData } = require("worker_threads");
const fs = require("fs");
const csvParser = require("csv-parser");

const { filePath, uploadId } = workerData;

const customers = {};
let countIdx = 0;
const batchSize = process.env.BATCH_SIZE;
let batchIdx = -1;

const stream = fs
  .createReadStream(filePath)
  .pipe(csvParser(["Name", "mobile-number"]));

stream.on("data", (row) => {
  // Save customer data to an array
  const newCustomer = {
    name: row["Name"],
    mobileNumber: row["mobile-number"],
    upload_id: uploadId,
  };

  if (countIdx % batchSize === 0) {
    batchIdx++;
    customers[batchIdx] = [];
  }

  customers[batchIdx].push(newCustomer);

  countIdx++;
});

stream.on("end", () => {
  parentPort.postMessage({ customers, countIdx });
});
