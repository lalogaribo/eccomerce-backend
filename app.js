const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv/config");
const { dbConnector } = require("./utilities/db-connector");

app.use(cors());
app.options("*", cors());

//middleware
app.use(bodyParser.json());
app.use(morgan("tiny"));

//Routes
const categoriesRoutes = require("./routes/categories");
const productsRoutes = require("./routes/products");
const usersRoutes = require("./routes/users");
const ordersRoutes = require("./routes/orders");

const api = process.env.API_URL;
console.log(api);
app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

//Database
dbConnector();
//Server
app.listen(3000, () => {
  console.log("server is running http://localhost:3000");
});
