const express = require("express");
const router = express.Router();

const { ordersController } = require("../controllers/orders.controller");

router.get(`/`, ordersController.getAllOrders);

router.get(`/:orderId`, ordersController.getSingleOrder);

router.post("/", ordersController.createOrder);

router.put("/:orderId", ordersController.updateOrder);

router.get("/get/totalsales", ordersController.totalSales);

router.get(`/get/myOrders/:userId`, ordersController.myOrders);

module.exports = router;
