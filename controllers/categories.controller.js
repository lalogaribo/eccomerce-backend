const { request, response } = require("express");

const { Category } = require("../models/category");

const getAllCategories = async (req = request, res = response) => {
  const categoryList = await Category.find().select();

  if (!categoryList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send({ success: true, categoryList });
};

const getSingleCategory = async (req = request, res = response) => {
  const { categoryId } = req.params;

  try {
    const category = await Category.findById(categoryId);
    res.status(200).send({ success: true, category });
  } catch (error) {
    res.status(404).send({ success: false, message: "Category not found" });
  }
};

const updateCategory = async (req = request, res = response) => {
  const { categoryId } = req.params;

  try {
    const category = await Category.findByIdAndUpdate(
      categoryId,
      {
        ...req.body,
      },
      { new: true }
    );

    res
      .status(200)
      .send({ success: true, category, message: "Category updated" });
  } catch (error) {
    res.status(404).send({ success: false, message: "Category not found" });
  }
};

const createCategory = async (req = request, res = response) => {
  let newCategory = new Category({
    ...req.body,
  });

  try {
    await newCategory.save();
    res.status(201).send({ success: true, category: newCategory });
  } catch (error) {
    res
      .status(401)
      .send({ success: false, message: "Unable to create the category" });
  }
};

const deleteCategory = async (req = request, res = response) => {
  const { categoryId } = req.params;
  try {
    await Category.findByIdAndRemove(categoryId);
    res
      .status(200)
      .send({ success: true, message: "Category was deleted successfully" });
  } catch (error) {
    res.status(404).send({ success: false, message: "Category not found" });
  }
};

module.exports = {
  categoryController: {
    getAllCategories,
    getSingleCategory,
    updateCategory,
    createCategory,
    deleteCategory,
  },
};
