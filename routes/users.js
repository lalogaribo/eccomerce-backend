const express = require("express");
const { userController } = require("../controllers/user.controller");
const router = express.Router();

router.get(`/`, userController.getAllUsers);

router.put("/:userId", userController.updateUser);

router.post("/", userController.createUser);

router.get("/:userId", userController.getSingleUser);

router.delete("/:userId", userController.deleteUser);

router.post("/login", userController.login);

router.post("/register", userController.register);

router.get("/get/count", userController.getCount);

module.exports = router;
