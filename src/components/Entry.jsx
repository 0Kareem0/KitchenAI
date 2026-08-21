import React, { useEffect, useRef, useState } from "react";
import IngredientsList from "../components/IngredientsList";
import ClaudeRecipe from "../components/ClaudeRecipe";
import { getRecipeFromMistral } from "../logic/ai";
import { PlusIcon, SparklesIcon, ChefHatIcon, FilterIcon, RefreshIcon } from "../components/Icons";

const QUICK_PRESETS = [
  { name: "Pasta", icon: "🍝" },
  { name: "Ground Beef", icon: "🥩" },
  { name: "Tomato Paste", icon: "🍅" },
  { name: "Garlic", icon: "🧄" },
  { name: "Parmesan", icon: "🧀" },
  { name: "Olive Oil", icon: "🫒" },
  { name: "Onion", icon: "🧅" },
  { name: "Eggs", icon: "🥚" },
  { name: "Avocado", icon: "🥑" },
  { name: "Butter", icon: "🧈" },
  { name: "Lemon", icon: "🍋" },
  { name: "Basil", icon: "🌿" }
];

export default function Main({ onSavedCountChange, onSaveRecipeTrigger }) {
  const [ingredients, setIngredients] = useState([
    "Pasta",
    "Ground Beef",
    "Tomato Paste",
    "Garlic"
  ]);

  const [recipeShown, setRecipeShown] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  // Preference options
  const [cuisine, setCuisine] = useState("Any");
  const [mealType, setMealType] = useState("Any");
  const [dietary, setDietary] = useState("None");
  const [showPreferences, setShowPreferences] = useState(false);

  // Error / Toast state
  const [errorMsg, setErrorMsg] = useState("");

  // Saved recipes state
  const [savedRecipes, setSavedRecipes] = useState(() => {
    try {
      const stored = localStorage.getItem("chef_claude_saved_recipes");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const recipeSectionRef = useRef(null);

  useEffect(() => {
    onSavedCountChange(savedRecipes.length);
  }, [savedRecipes, onSavedCountChange]);

  useEffect(() => {
    if (recipeShown !== "" && recipeSectionRef.current) {
      recipeSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [recipeShown]);

  // Loading animation step timer
  useEffect(() => {
    let interval;
    if (isLoading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < 2 ? prev + 1 : prev));
      }, 1400);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const getRecipe = async () => {
    if (ingredients.length < 2) {
      setErrorMsg("Please add at least 2 ingredients to generate a recipe.");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }

    setIsLoading(true);
    setRecipeShown("");
    setErrorMsg("");

    try {
      const recipe = await getRecipeFromMistral(ingredients, { cuisine, mealType, dietary });
      setRecipeShown(recipe);
    } catch (error) {
      console.error("Failed to fetch recipe:", error);
      setErrorMsg("Sorry, something went wrong while generating the recipe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddIngredient = (ingredientName) => {
    const trimmed = ingredientName.trim();
    if (!trimmed) return;

    // Check duplicate case-insensitive
    if (ingredients.some((ing) => ing.toLowerCase() === trimmed.toLowerCase())) {
      setErrorMsg(`"${trimmed}" is already in your ingredients list.`);
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }

    setIngredients((prev) => [...prev, trimmed]);
    setErrorMsg("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newIngredient = formData.get("ingredient");
    if (newIngredient) {
      handleAddIngredient(newIngredient);
      event.currentTarget.reset();
    }
  };

  const removeIngredient = (indexToRemove) => {
    setIngredients((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const clearIngredients = () => {
    setIngredients([]);
    setRecipeShown("");
  };

  const handleSaveRecipe = () => {
    if (!recipeShown) return;

    // Extract title from markdown if possible
    const titleMatch = recipeShown.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].replace(/[👨‍🍳✨]/g, "").trim() : "Gourmet Recipe";

    const existingIndex = savedRecipes.findIndex((r) => r.content === recipeShown);

    if (existingIndex >= 0) {
      // Unsave if already saved
      const updated = savedRecipes.filter((_, i) => i !== existingIndex);
      setSavedRecipes(updated);
      localStorage.setItem("chef_claude_saved_recipes", JSON.stringify(updated));
    } else {
      // Save recipe
      const newSavedItem = {
        id: Date.now().toString(),
        title,
        content: recipeShown,
        ingredients: [...ingredients],
        date: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
      };
      const updated = [newSavedItem, ...savedRecipes];
      setSavedRecipes(updated);
      localStorage.setItem("chef_claude_saved_recipes", JSON.stringify(updated));
    }
  };

  const isCurrentRecipeSaved = savedRecipes.some((r) => r.content === recipeShown);

  const loadingMessages = [
    { title: "Analyzing Ingredients...", subtitle: `Evaluating flavor pairings for ${ingredients.join(", ")}` },
    { title: "Crafting Culinary Balance...", subtitle: "Balancing aromatics, seasonings, and cooking techniques" },
    { title: "Writing Step-by-Step Directions...", subtitle: "Finalizing presentation notes and chef tips" }
  ];

  return (
    <main className="main-content">
      {/* Hero Header Section */}
      <section className="hero-section">
        <div className="hero-pill">
          <SparklesIcon className="sparkle-icon" /> AI-Powered Gourmet Kitchen
        </div>
        <h1 className="hero-title">What's in your pantry?</h1>
        <p className="hero-subtitle">
          Add your available ingredients below. Chef Claude will craft an incredible custom recipe tailored just for you.
        </p>

        {/* Form Input */}
        <form onSubmit={handleSubmit} className="add-ingredient-form">
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="e.g. Fresh Garlic, Olive Oil, Salmon..."
              aria-label="Add ingredient"
              name="ingredient"
              className="ingredient-input"
              autoComplete="off"
            />
          </div>
          <button type="submit" className="add-btn">
            <PlusIcon className="btn-icon" />
            <span>Add Item</span>
          </button>
        </form>

        {/* Error Toast */}
        {errorMsg && (
          <div className="toast-error" role="alert">
            <span>⚠️ {errorMsg}</span>
          </div>
        )}

        {/* Quick Add Presets */}
        <div className="quick-presets">
          <span className="presets-label">Quick Add:</span>
          <div className="preset-chips-scroll">
            {QUICK_PRESETS.map((item) => {
              const isAdded = ingredients.some((ing) => ing.toLowerCase() === item.name.toLowerCase());
              return (
                <button
                  key={item.name}
                  type="button"
                  className={`preset-chip ${isAdded ? "added" : ""}`}
                  onClick={() => !isAdded && handleAddIngredient(item.name)}
                  disabled={isAdded}
                  title={isAdded ? `${item.name} added` : `Add ${item.name}`}
                >
                  <span className="preset-icon">{item.icon}</span>
                  <span className="preset-name">{item.name}</span>
                  {isAdded ? <span className="added-check">✓</span> : <span className="plus-sign">+</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Culinary Preferences Accordion / Bar */}
        <div className="preferences-bar">
          <button
            type="button"
            className="preferences-toggle-btn"
            onClick={() => setShowPreferences(!showPreferences)}
          >
            <FilterIcon className="btn-icon-sm" />
            <span>Culinary Preferences ({cuisine !== "Any" || mealType !== "Any" || dietary !== "None" ? "Customized" : "Optional"})</span>
            <span className="chevron">{showPreferences ? "▲" : "▼"}</span>
          </button>

          {showPreferences && (
            <div className="preferences-options-grid">
              <div className="pref-group">
                <label htmlFor="cuisine-select">Cuisine Style</label>
                <select 
                  id="cuisine-select" 
                  value={cuisine} 
                  onChange={(e) => setCuisine(e.target.value)}
                >
                  <option value="Any">Any Cuisine</option>
                  <option value="Italian">Italian 🍝</option>
                  <option value="Asian">Asian / Fusion 🍜</option>
                  <option value="Mexican">Mexican 🌮</option>
                  <option value="Mediterranean">Mediterranean 🥗</option>
                  <option value="French">French Bistro 🍷</option>
                  <option value="American">American Bistro 🍔</option>
                </select>
              </div>

              <div className="pref-group">
                <label htmlFor="meal-select">Meal Type</label>
                <select 
                  id="meal-select" 
                  value={mealType} 
                  onChange={(e) => setMealType(e.target.value)}
                >
                  <option value="Any">Any Meal</option>
                  <option value="Dinner">Dinner 🍽️</option>
                  <option value="Lunch">Quick Lunch 🥪</option>
                  <option value="Breakfast">Breakfast / Brunch 🍳</option>
                  <option value="Snack">Snack / Appetizer 🥨</option>
                </select>
              </div>

              <div className="pref-group">
                <label htmlFor="dietary-select">Dietary Requirement</label>
                <select 
                  id="dietary-select" 
                  value={dietary} 
                  onChange={(e) => setDietary(e.target.value)}
                >
                  <option value="None">No Restriction</option>
                  <option value="Vegetarian">Vegetarian 🌱</option>
                  <option value="Low Carb">Low Carb / Keto 🥩</option>
                  <option value="Gluten-Free">Gluten-Free 🌾</option>
                  <option value="High Protein">High Protein 💪</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Ingredients List Component */}
      <IngredientsList
        ingredients={ingredients}
        removeIngredient={removeIngredient}
        clearIngredients={clearIngredients}
        getRecipe={getRecipe}
        recipeSectionRef={recipeSectionRef}
      />

      {/* Modern AI Loader */}
      {isLoading && (
        <div className="loading-card" aria-live="polite">
          <div className="loading-content">
            <div className="chef-spinner-wrapper">
              <div className="pulse-ring"></div>
              <div className="pulse-ring-outer"></div>
              <ChefHatIcon className="spinner-chef-hat" />
            </div>

            <div className="loading-text-container">
              <h3 className="loading-step-title">{loadingMessages[loadingStep].title}</h3>
              <p className="loading-step-subtitle">{loadingMessages[loadingStep].subtitle}</p>
            </div>

            <div className="loading-progress-bar">
              <div 
                className="loading-progress-fill" 
                style={{ width: `${((loadingStep + 1) / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Recipe Component */}
      {recipeShown && !isLoading && (
        <ClaudeRecipe 
          recipe={recipeShown} 
          onSaveRecipe={handleSaveRecipe}
          isSaved={isCurrentRecipeSaved}
        />
      )}
    </main>
  );
}
