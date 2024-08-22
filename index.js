const express = require("express");
const cors = require("cors");
const { connectToDatabase } = require("./config/db");
const { addAnimal } = require("./collections/animals");
const {
  router: addAnimalRouter,
  setAnimalsCollection,
} = require("./routes/animals");
const {
  router: categoriesRouter,
  setCategoriesCollection,
  setDatabase,
} = require("./routes/categories");
const { createCollections } = require("./hooks/createCollection");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectToDatabase()
  .then(async (db) => {
    animalsCollection = await createCollections(db, "animalsCollection");
    setAnimalsCollection(animalsCollection);

    categoriesCollection = await createCollections(db, "categoriesCollection");
    setCategoriesCollection(categoriesCollection);

    setDatabase(db, animalsCollection); 
  })
  .catch((err) => {
    console.error("Failed to set up database and collections:", err);
  });

app.get("/", (req, res) => res.send(`<h1>Server is running.</h1>`));

app.use("/animals", addAnimalRouter);
app.use("/categories", categoriesRouter);

app.listen(port, () => console.log(`Server is running on port: ${port}`));
