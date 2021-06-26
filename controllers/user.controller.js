const User = require("../models/user");
const { request, response } = require("express");

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find().select("-password ");
    res.status(200).send(allUsers);
  } catch (e) {
    res.status(500).send({ success: false, message: "No users created" });
  }
};

const getSingleUser = async (req, res) => {
  const { userId } = req.params;

  try {
    let user = await User.findById(userId).select("-password");
    res.status(200).send({ success: true, user });
  } catch (e) {
    res
      .status(404)
      .send({ success: false, message: "User with given id doesnt exist" });
  }
};

const updateUser = async (req, res) => {
  const { userId } = req.params;

  try {
    let user = await User.findByIdAndUpdate(
      userId,
      { ...req.body },
      { new: true }
    );
    res.status(200).send({ success: true, user });
  } catch (e) {
    res
      .status(404)
      .send({ success: false, message: "User with given id doesnt exist" });
  }
};

const createUser = async (req, res) => {
  let user = new User({ ...req.body });

  try {
    await user.save();
    res.status(201).send({ success: true, user });
  } catch (e) {
    res.status(404).send({ success: false, message: "An error" });
  }
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    await User.findByIdAndRemove(userId);
    res
      .status(200)
      .send({ success: true, message: "User was deleted successfully" });
  } catch (error) {
    res.status(404).send({ success: false, message: "User not found" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateJwtToken();
    res.send({ user, token });
  } catch (e) {
    res.status(404).send(e.message);
  }
};

const register = async (req, res) => {
  let user = new User({ ...req.body });

  try {
    await user.save();
    res.status(201).send({ success: true, user });
  } catch (e) {
    res.status(404).send({ success: false, message: "An error" });
  }
};

const getCount = async (req, res) => {
  const userCount = await User.countDocuments((count) => count);

  if (!userCount) {
    res.status(500).json({ success: false });
  }
  res.status(200).send({ success: true, count: userCount });
};

module.exports = {
  userController: {
    getAllUsers,
    getSingleUser,
    updateUser,
    createUser,
    deleteUser,
    login,
    register,
    getCount,
  },
};
