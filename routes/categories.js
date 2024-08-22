const express = require("express");
const { getAllCategories, addCategory } = require("../collections/categories");
const { deleteCategory } = require("../collections/deleteCategory");

const router = express.Router();

let categoriesCollection;

function setCategoriesCollection(collection) {
  categoriesCollection = collection;
}

// POST route to add a new category
router.post("/", async (req, res) => {
  const { category } = req.body;

  if (!category) {
    return res.status(400).json({ message: "Category name is required." });
  }

  try {
    const newCategory = await addCategory(categoriesCollection, category);
    console.log(newCategory)
    res
      .status(201)
      .json({ message: "Category added successfully!", category: newCategory });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to add category", error: err.message });
  }
});

// GET route to retrieve all categories
router.get("/", async (req, res) => {
  console.log("Categories API");
  try {
    const categories = await getAllCategories(categoriesCollection);
    res.status(200).json(categories);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to retrieve categories", error: err.message });
  }
});

let db;
let animalsCollection;

function setDatabase(database, animalsCol) {
  db = database;
  animalsCollection = animalsCol;
}

// DELETE route to delete a category
router.delete("/:categoryName", async (req, res) => {
  const { categoryName } = req.params;
  try {
    const result = await deleteCategory(db, categoryName, animalsCollection);
    console.log(result)

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "Failed to delete category", error: err.message });
  }
});

// Additional routes for categories can be added here...

module.exports = { router, setCategoriesCollection, setDatabase };
