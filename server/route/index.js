const express = require("express");
const router = express.Router();
const Upload = require("../model/upload");
const { parseCSVAndCreateBatches } = require("../helpers/parseCSV");
const { processBatchesInParallel } = require("../helpers/processBatches");
const fs = require("fs");
const Customer = require("../model/customer");

router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find({}).sort({ _id: -1 }).limit(100);

    res.status(200).json({ customers });
  } catch (err) {
    console.error("Error uploading file:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/upload", async (req, res) => {
  const { io } = req.app;

  try {
    const csvFile = req.files.csvFile;
    const fileName = `${Date.now()}_${csvFile.name.replace(" ", "_")}`;

    // Save the uploaded CSV file
    await csvFile.mv(`uploads/${fileName}`);

    // Create a new upload session
    const newUpload = await Upload.create({
      file_name: fileName,
      total_records: 0, // Will be updated after parsing the CSV
      uploaded_records: 0,
      status: "pending",
      start_time: new Date(),
      end_time: null,
    });

    res.status(200).json({ success: true });

    console.log(`#2024118173716243 Started Processing`);

    // Parse CSV file and create batches
    const customers = [];
    const batches = await parseCSVAndCreateBatches(
      `uploads/${fileName}`,
      newUpload._id,
      customers
    );

    newUpload.total_records = customers.length;
    await newUpload.save();

    console.log(`#2024118171546303 Batches extracted`);

    // Process batches in parallel
    await processBatchesInParallel(newUpload._id, batches, customers, io);

    console.log(`#2024118171558506 Db operation done`);

    // Update upload status to 'completed'
    newUpload.status = "completed";
    newUpload.end_time = new Date();
    await newUpload.save();

    // Delete CSV file if upload is successful
    fs.unlinkSync(`uploads/${fileName}`);
  } catch (err) {
    console.error("Error uploading file:", err);
    // res.status(500).send("Internal Server Error");

    io.emit("progressError", {
      message: "Upload failed!",
    });
  }
});

module.exports = router;
