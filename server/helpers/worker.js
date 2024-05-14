require("../config/database").connect();
const { parentPort, workerData } = require("worker_threads");

const process = async () => {
  console.time("DB Operation");
  parentPort.postMessage({ done: false, uploadedRecords });

  console.timeEnd("DB Operation");
};

process().then(() => {
  parentPort.postMessage({ done: true });
});
