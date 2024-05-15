const express = require("express");
const router = express.Router();
const Upload = require("../model/upload");
const fs = require("fs");
const Customer = require("../model/customer");

const { uploadData } = require("../helpers/uploadData");
const { parseCSVAndCreateBatches } = require("../helpers/parseCSV");
const Batch = require("../model/batch");

router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find({}).sort({ _id: -1 }).limit(10000);

    res.status(200).json({ success: true, customers });
  } catch (err) {
    console.error("Error:", err);
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
      total_records: 0, // this will be updated after parsing the CSV
      uploaded_records: 0, // this will be updated after each batch successful upload
      status: "pending", // the status will be updated to completed when the whole upload is done
      start_time: new Date(),
      end_time: null,
    });

    const uploadId = newUpload._id.toString();

    res.status(200).json({ success: true });

    // io.emit("UploadingProgress", {
    //   update: "Started",
    //   uploadId,
    // });

    // Parse CSV file and create batches
    const { batches, customers, countIdx } = await parseCSVAndCreateBatches(
      `uploads/${fileName}`,
      uploadId
    );

    newUpload.total_records = countIdx;
    await newUpload.save();

    await uploadData(batches, customers, uploadId, io);

    // Update upload status to 'completed'
    newUpload.status = "completed";
    newUpload.end_time = new Date();
    await newUpload.save();

    //Deleting all the batches from DB when upload is successful
    await Batch.deleteMany({ upload_id: uploadId });

    // Delete CSV file when upload is successful
    fs.unlinkSync(`uploads/${fileName}`);

    io.emit("UploadingProgress", {
      update: "Completed",
      uploadId,
    });
  } catch (err) {
    console.error("Error uploading file:", err);
    // res.status(500).send("Internal Server Error");

    io.emit("UploadingProgress", {
      update: "Upload failed",
    });
  }
});

module.exports = router;
