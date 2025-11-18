import React, { useState } from "react";
import IngredientsList from "../components/IngredientsList";
import ClaudeRecipe from "../components/ClaudeRecipe";
import { getRecipeFromMistral } from "../logic/ai";

/**
 * Challenge: Get a recipe from the AI!
 * 
 * This will be a bit harder of a challenge that will require you
 * to think critically and synthesize the skills you've been
 * learning and practicing up to this point.
 * 
 * Using either the `getRecipeFromChefClaude` function or the 
 * `getRecipeFromMistral` function, make it so that when the user
 * clicks "Get a recipe", the text response from the AI is displayed
 * in the <ClaudeRecipe> component.
 * 
 * For now, just have it render the raw markdown that the AI returns,
 * don't worry about making it look nice yet. (We're going to use a
 * package that will render the markdown for us soon.)
 */

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
    console.log(formData.get("ingredient"));
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
 