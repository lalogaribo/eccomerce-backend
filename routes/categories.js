const { Category } = require("../models/category");
const express = require("express");
const router = express.Router();

router.get(`/`, async (req, res) => {
  const categoryList = await Category.find().select();

  if (!categoryList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send({success: true, categoryList});
});

router.get("/:categoryId", async (req, res) => {
  const { categoryId } = req.params;

  try {
    const category = await Category.findById(categoryId);
    res.status(200).send({ success: true, category });
  } catch (error) {
    res.status(404).send({ success: false, message: "Category not found" });
  }
});

router.put("/:categoryId", async (req, res) => {
  const { categoryId } = req.params;

  try {
    const category = await Category.findByIdAndUpdate(
      categoryId,
      {
        ...req.body
      },
      { new: true }
    );

    res
      .status(200)
      .send({ success: true, category, message: "Category updated" });
  } catch (error) {
    res.status(404).send({ success: false, message: "Category not found" });
  }
});

router.post("/", async (req, res) => {
  let newCategory = new Category({
    ...req.body
  });

  try {
    await newCategory.save();
    res.status(201).send({ success: true, category: newCategory });
  } catch (error) {
    res
      .status(401)
      .send({ success: false, message: "Unable to create the category" });
  }
});

router.delete("/:categoryId", async (req, res) => {
  const { categoryId } = req.params;
  try {
    await Category.findByIdAndRemove(categoryId);
    res
      .status(200)
      .send({ success: true, message: "Category was deleted successfully" });
  } catch (error) {
    res.status(404).send({ success: false, message: "Category not found" });
  }
});

module.exports = router;
