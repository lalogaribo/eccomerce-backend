const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const errorHandler = require("./utilities/error_handler");
// const authentication = require("./middlewares/jwt");
const { dbConnector } = require("./utilities/db-connector");
const api = process.env.API_URL;
const productRoutes = require("./routes/products");
const userRoutes = require("./routes/users");

class Server {
  constructor() {
    this.app = express();
    this.middlewares();
    this.dbConnector();
    this.routes();
    // this.app.options("*", cors());
  }

  listen() {
    this.app.listen(process.env.PORT, () => {
      console.log("server is running on port", process.env.PORT);
    });
  }

  routes() {
    this.app.use(`${api}/users`, userRoutes);
    this.app.use(`${api}/products`, productRoutes);
  }

  middlewares() {
    // this.app.use(authentication);
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(morgan("tiny"));
    this.app.use(errorHandler);
  }

  dbConnector() {
    dbConnector();
  }
}

module.exports = Server;
