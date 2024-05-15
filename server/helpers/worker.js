const { parentPort, workerData } = require("worker_threads");
const fs = require("fs");
const csvParser = require("csv-parser");

const { filePath, uploadId } = workerData; //getting the data from the main thread

const customers = {};
let countIdx = 0; // for counting the current number of rows or data entries
const batchSize = process.env.BATCH_SIZE;
let batchIdx = -1; // for counting the batches in which the data is going to split

//CSV file is read as a stream and piped through the `csv-parser`.
const stream = fs
  .createReadStream(filePath)
  .pipe(csvParser(["Name", "mobile-number"])); //update columns names based on the requirement

stream.on("data", (row) => {
  // Save customer data to a batch array
  const newCustomer = {
    name: row["Name"],
    mobileNumber: row["mobile-number"],
    upload_id: uploadId,
  };

  //Creating a new batch array, after a fixes batch size
  if (countIdx % batchSize === 0) {
    batchIdx++;
    customers[batchIdx] = [];
  }

  customers[batchIdx].push(newCustomer);

  countIdx++;
});

//On end of the stream emit the message with the parsed data to the main thread
stream.on("end", () => {
  parentPort.postMessage({ customers, countIdx });
});
