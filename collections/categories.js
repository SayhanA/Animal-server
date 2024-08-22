// async function addCategory(categoriesCollection, category) {
//   const result = await categoriesCollection.insertOne({ category });
//   return result.ops[0];
// }

async function addCategory(categoriesCollection, category) {
  try {
    // Check if the category already exists
    const existingCategory = await categoriesCollection.findOne({
      category: category,
    });
    console.log(existingCategory);

    if (existingCategory) {
      return { error: `Category with the name '${category}' already exists.` };
    }

    //   Insert the new category if it doesn't exist
    const result = await categoriesCollection.insertOne({ category });
    return result.ops[0];
  } catch (err) {
    console.error("Failed to add category", err);
    throw err;
  }
}

module.exports = { addCategory };

async function getAllCategories(categoriesCollection) {
  return await categoriesCollection.find({}).toArray();
}

module.exports = { addCategory, getAllCategories };
