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

  const [recipeShown, setRecipeShown] = useState("");
  const [isLoading, setIsLoading] = useState(false); // ← NEW: loading state

  const getRecipe = async () => {
    setIsLoading(true); // Start loading
    setRecipeShown(""); // Optional: clear previous recipe
    try {
      const recipe = await getRecipeFromMistral(ingredients);
      setRecipeShown(recipe);
    } catch (error) {
      console.error("Failed to fetch recipe:", error);
      setRecipeShown("Sorry, something went wrong. Please try again.");
    } finally {
      setIsLoading(false); // Always stop loading
    }
  };

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newIngredient = formData.get("ingredient").trim();
    if (newIngredient) {
      setIngredients((prev) => [...prev, newIngredient]);
      event.target.reset(); // clear input after adding
    }
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
        <button type="submit">Add ingredient</button>
      </form>

      {ingredients.length ? (
        <IngredientsList getRecipe={getRecipe} ingredients={ingredients} />
      ) : null}

      {isLoading ? (
        <div className="loading-container">
          <div className="spinner" aria-label="Generating recipe..." />
          <p>Thinking of the perfect recipe...</p>
        </div>
      ) : null}

      {recipeShown && !isLoading ? <ClaudeRecipe recipe={recipeShown} /> : null}
    </main>
  );
}
