const { Order } = require("../models/order");
const { OrderItem } = require("../models/orderItem");

const getAllOrders = async (req, res) => {
  const orderList = await Order.find()
    .populate("user", "name")
    .sort({ createdAt: -1 });

  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.send(orderList);
};

const getSingleOrder = async (req, res) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId).populate({
    path: "orderItems",
    populate: { path: "product", populate: "category" },
  });

  if (!order) {
    res.status(500).json({ success: false });
  }
  res.send(order);
};

const createOrder = async (req, res) => {
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });
      newOrderItem = await newOrderItem.save();
      return newOrderItem._id;
    })
  );
  const resolvedOrder = await orderItemsIds;

  const totalPrices = await Promise.all(
    resolvedOrder.map(async (orderItem) => {
      const item = await OrderItem.findById(orderItem).populate(
        "product",
        "price"
      );
      const total = item.product.price * item.quantity;
      return total;
    })
  );

  const total = totalPrices.reduce((a, b) => a + b, 0);
  let order = new Order({
    ...req.body,
    orderItems: resolvedOrder,
    totalPrice: total,
  });

  try {
    await order.save();
    res.status(201).send({ success: true, order });
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateOrder = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  try {
    let order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate("orderItems");
    res.status(200).send({ success: true, order });
  } catch (error) {
    res.send(error);
  }
};

const myOrders = async (req, res) => {
  const { userId } = req.params;
  const myOrders = await Order.find({ user: userId })
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    })
    .sort({ createdAt: -1 });

  if (!myOrders) {
    res.status(500).json({ success: false });
  }
  res.send(myOrders);
};

const totalSales = async (req, res) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } },
  ]);
  if (!totalSales) {
    return res.status(400).send("The total sales cant be generated");
  }
  res.status(200).send(totalSales);
};

module.exports = {
  ordersController: {
    getAllOrders,
    getSingleOrder,
    createOrder,
    updateOrder,
    myOrders,
    totalSales,
  },
};
