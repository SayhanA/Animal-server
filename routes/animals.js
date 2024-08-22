const express = require("express");
const { addAnimal } = require("../collections/animals");
const { ObjectId } = require("mongodb");

const router = express.Router();

let animalsCollection;

function setAnimalsCollection(collection) {
  animalsCollection = collection;
}

// GET route to retrieve all unique categories
router.get("/categories", async (req, res) => {
    console.log("categories API");
  try {
    const categories = await animalsCollection.distinct("category");
    res.status(200).json(categories);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to retrieve categories", error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { name, imageUrl, category } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Animal name is required" });
  } else if (!imageUrl) {
    return res.status(400).json({ message: "Animal image url is required" });
  } else if (!category) {
    return res.status(400).json({ message: "Animal Category is required." });
  }

  try {
    const animal = { name, imageUrl, category };
    const insertedAnimal = await addAnimal(animalsCollection, animal);
    res
      .status(201)
      .json({ message: "Animal added successfully!", animal: insertedAnimal });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to add animal", error: err.message });
  }
});

// PATCH route to update an animal
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, imageUrl, category } = req.body;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid animal ID." });
  }

  const updateFields = {};
  if (name) updateFields.name = name;
  if (imageUrl) updateFields.imageUrl = imageUrl;
  if (category) updateFields.category = category;

  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({ message: "No valid fields to update." });
  }

  try {
    const result = await animalsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Animal not found." });
    }

    const updatedAnimal = await animalsCollection.findOne({
      _id: new ObjectId(id),
    });
    res
      .status(200)
      .json({ message: "Animal updated successfully!", animal: updatedAnimal });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update animal", error: err.message });
  }
});

// GET route to retrieve all animals with optional case-insensitive category filter
router.get("/", async (req, res) => {
  const { category } = req.query;

  const filter = {};
  if (category) {
    filter.category = { $regex: new RegExp(category, "i") };
  }

  try {
    const animals = await animalsCollection.find(filter).toArray();
    res.status(200).json(animals);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to retrieve animals", error: err.message });
  }
});

// GET route to retrieve a specific animal by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid animal ID." });
  }

  try {
    const animal = await animalsCollection.findOne({ _id: new ObjectId(id) });

    if (!animal) {
      return res.status(404).json({ message: "Animal not found." });
    }

    res.status(200).json(animal);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to retrieve animal", error: err.message });
  }
});

// DELETE route to remove an animal
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid animal ID." });
  }

  try {
    const result = await animalsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Animal not found." });
    }

    res.status(200).json({ message: "Animal deleted successfully!" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete animal", error: err.message });
  }
});

module.exports = { router, setAnimalsCollection };
