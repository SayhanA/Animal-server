
async function addAnimal(collection, animal) {
  try {
    const result = await collection.insertOne(animal);

    if (result.acknowledged) {
      const insertedAnimal = await collection.findOne({
        _id: result.insertedId,
      });
      console.log("Animal added:", insertedAnimal);

      return insertedAnimal;
    } else {
      throw new Error("Failed to insert the animal document.");
    }
  } catch (err) {
    console.error("Failed to add animal", err);
    throw err;
  }
}

module.exports = { addAnimal };
