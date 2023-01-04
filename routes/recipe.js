const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe");
const fetchuser = require("../middleware/fetchuser");

// ROUTE: 1; Get loggedin user details using GET "/api/recipe/fetchallrecipes". login required.
router.get("/fetchallrecipes", async (req, res) => {
  try {
    const recipes = await Recipe.find(req.id);
    res.json(recipes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE: 2; Add a new recipe using POST "/api/recipe/addrecipe". login required.
router.post("/addrecipe", fetchuser, async (req, res) => {
  try {
    const { title, iframe, directions, ingredients, thumbnail, tags } =
      req.body;
    const recipe = new Recipe({
      title,
      iframe,
      directions,
      ingredients,
      thumbnail,
      tags,
      user: req.user.id,
    });
    const savedRecipe = await recipe.save();
    res.json(savedRecipe);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE: 3; Update an existing recipe using PUT "/api/recipe/updaterecipe". login required.
router.put("/updaterecipe/:id", fetchuser, async (req, res) => {
  const { title, iframe, directions, ingredients, thumbnail, tags } = req.body;

  try {
    //Create a newRecipe object
    const newRecipe = {};
    if (title) {
      newRecipe.title = title;
    }
    if (iframe) {
      newRecipe.iframe = iframe;
    }
    if (directions) {
      newRecipe.directions = directions;
    }
    if (ingredients) {
      newRecipe.ingredients = ingredients;
    }
    if (thumbnail) {
      newRecipe.thumbnail = thumbnail;
    }
    if (tags) {
      newRecipe.tags = tags;
    }

    // Find the recipe to be updated and update it
    let recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).send("Page Not Found");
    }
    if (recipe.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { $set: newRecipe },
      { new: true }
    );
    res.json({ recipe });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE: 4; Delete an existing recipe using DELETE "/api/recipe/deleterecipe". login required.
router.delete("/deleterecipe/:id", fetchuser, async (req, res) => {
  try {
    // Find the recipe to be delete and delete it
    let recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).send("Page Not Found");
    }

    // Allow deletion only if user owns this recipe
    if (recipe.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    recipe = await Recipe.findByIdAndDelete(req.params.id);
    res.json({ Success: "Recipe has been deleted", recipe: recipe });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE: 5; Get recipe by id using GET "/api/recipe/fetchrecipe/:id".
router.get("/fetchrecipe/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    res.json(recipe);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE: 6; Get recipe by tags using GET "/api/recipe/fetchbytags".
router.get("/fetchbytags/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    const recipetags = recipe.tags[0];
    const recipetagsfind = await Recipe.find({tags: { $elemMatch: { $in: recipetags } }, _id: { $ne: req.params.id }});
    res.json(recipetagsfind);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE: 7; Get recipe by tags for search using GET "/api/recipe/search/:key".
router.get("/search/:key", async (req, res) => {
  try {
    const recipe = await Recipe.find({tags: { $elemMatch: { $in: req.params.key } }});
    res.json(recipe);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE: 8; Get recipe by date using GET "/api/recipe/latest".
router.get("/latest", async (req, res) => {
  try {
    const recipes = await Recipe.find(req.id).sort({_id: -1}).limit(8);
    res.json(recipes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
