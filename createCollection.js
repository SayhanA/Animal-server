async function createCollections(db, collectionName) {
  try {
    // Create a collection called 'animalsCollection' if it doesn't exist
    const collection = db.collection(collectionName);
    console.log(`Collection ${collectionName} is ready!`);
    return collection;
  } catch (err) {
    console.error("Failed to create collection", err);
    throw err;
  }
}
module.exports = { createCollections };