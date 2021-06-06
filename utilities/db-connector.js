const mongoose = require("mongoose");

const db_connector = () => {
  mongoose
    .connect(process.env.CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // dbName: "eshop-database",
    })
    .then(() => {
      console.log("Database Connection is ready...");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.dbConnector = db_connector;
