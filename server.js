const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const errorHandler = require("./utilities/error_handler");

const { dbConnector } = require("./utilities/db-connector");

class Server {
  constructor() {
    this.app = express();
    this.middlewares();
    this.dbConnector();
  }

  listen() {
    this.app.listen(process.env.PORT, () => {
      console.log("server is running on port", process.env.PORT);
    });
  }

  middlewares() {
    this.app.use(bodyParser());
    this.app.use(cors());
    this.app.use(morgan("tiny"));
    this.app.use(errorHandler);
  }

  dbConnector() {
    dbConnector();
  }
}

module.exports = Server;
