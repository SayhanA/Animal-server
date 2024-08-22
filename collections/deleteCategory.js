async function deleteCategory(db, categoryName, animalsCollection) {
    try {
      // Check if any animals are associated with the category
      const matchCount = await animalsCollection.countDocuments({ category: categoryName });
  
      if (matchCount > 0) {
        return { error: `Cannot delete category ${categoryName}. ${matchCount} animals are associated with this category.` };
      }
  
      // Proceed to delete the category if no matches are found
      await db.collection("categoriesCollection").deleteOne({ name: categoryName });
      console.log(`Category ${categoryName} has been deleted.`);
      return { message: `Category ${categoryName} has been deleted.` };
    } catch (err) {
      console.error("Failed to delete category", err);
      throw err;
    }
  }
  
  module.exports = { deleteCategory };
  