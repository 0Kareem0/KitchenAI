import React from "react";
import { SparklesIcon, TrashIcon, PlusIcon, RefreshIcon } from "./Icons";

export default function IngredientsList({ ingredients, removeIngredient, clearIngredients, getRecipe, recipeSectionRef }) {
  const ingredientsListItems = ingredients.map((ingredient, index) => (
    <li key={`${ingredient}-${index}`} className="ingredient-chip">
      <span className="chip-dot"></span>
      <span className="chip-text">{ingredient}</span>
      <button 
        type="button" 
        className="chip-remove-btn" 
        onClick={() => removeIngredient(index)}
        title={`Remove ${ingredient}`}
        aria-label={`Remove ${ingredient}`}
      >
        &times;
      </button>
    </li>
  ));

  return (
    <section className="ingredients-section" ref={recipeSectionRef}>
      <div className="ingredients-header">
        <div className="ingredients-title-wrapper">
          <h2 className="ingredients-title">Ingredients on hand</h2>
          <span className="ingredients-count-badge">{ingredients.length}</span>
        </div>
        {ingredients.length > 0 && (
          <button 
            type="button" 
            className="clear-all-btn"
            onClick={clearIngredients}
            title="Clear all ingredients"
          >
            <TrashIcon className="btn-icon-xs" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <ul className="ingredients-list" aria-live="polite">
        {ingredientsListItems}
      </ul>

      {ingredients.length >= 2 ? (
        <div className="get-recipe-card">
          <div className="get-recipe-content">
            <div className="card-badge">
              <SparklesIcon className="sparkle-icon" /> AI Gourmet Engine Ready
            </div>
            <h3 className="get-recipe-heading">Ready for your personalized recipe?</h3>
            <p className="get-recipe-subtext">
              Chef Claude will craft a custom step-by-step culinary masterwork using your {ingredients.length} ingredients.
            </p>
          </div>
          <button 
            type="button"
            className="get-recipe-btn"
            onClick={getRecipe}
          >
            <SparklesIcon className="btn-icon" />
            <span>Generate Recipe</span>
          </button>
        </div>
      ) : ingredients.length === 1 ? (
        <div className="add-more-hint">
          <p>💡 Add at least 1 more ingredient so Chef Claude can pair flavors!</p>
        </div>
      ) : null}
    </section>
  );
}
