const mongoose = require("mongoose");

const { DATABASE_URL } = process.env;

exports.connect = () => {
  mongoose
    .connect(DATABASE_URL, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true
    })
    .then(console.log("DB Connected Successfully!"))
    .catch((error) => {
      console.log("DB Connection Failed!");
      console.log(error);
      process.exit(1);
    });
};
