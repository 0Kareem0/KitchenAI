import React, { useState } from "react";
import IngredientsList from "../components/IngredientsList";
import ClaudeRecipe from "../components/ClaudeRecipe";
import { getRecipeFromMistral } from "../logic/ai";


export default function Main() {
  const [ingredients, setIngredients] = useState([
    "all the main spices",
    "pasta",
    "ground beef",
    "tomato paste",
  ]);
  console.log(ingredients);
  const [recipeShown, setRecipeShown] = useState("");
  const getRecipe = async () => {
    const recipe = await getRecipeFromMistral(ingredients);
    setRecipeShown(recipe);
    console.log(recipe);
    
  };

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newIngredient = formData.get("ingredient");
    setIngredients((prevIngredients) => [...prevIngredients, newIngredient]);
  }

  return (
    <main>
      <form onSubmit={handleSubmit} className="add-ingredient-form">
        <input
          type="text"
          placeholder="e.g. oregano"
          aria-label="Add ingredient"
          name="ingredient"
        />
        <button>Add ingredient</button>
      </form>
      {ingredients.length ? (
        <IngredientsList
          getRecipe={getRecipe}
          ingredients={ingredients}
        />
      ) : null}
      {recipeShown ? <ClaudeRecipe recipe={recipeShown} /> : null}
    </main>
  );
}
 