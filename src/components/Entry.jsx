import React, { useEffect, useRef, useState } from "react";
import IngredientsList from "../components/IngredientsList";
import ClaudeRecipe from "../components/ClaudeRecipe";
import Confetti from "../components/Confetti";
import { getRecipeFromMistral } from "../logic/ai";
import { PlusIcon, SparklesIcon, ChefHatIcon, FilterIcon, RefreshIcon } from "../components/Icons";

const CATEGORIZED_PRESETS = [
  { name: "Pasta", icon: "🍝", category: "Carbs" },
  { name: "Rice", icon: "🍚", category: "Carbs" },
  { name: "Ground Beef", icon: "🥩", category: "Proteins" },
  { name: "Chicken Breast", icon: "🍗", category: "Proteins" },
  { name: "Salmon", icon: "🐟", category: "Proteins" },
  { name: "Tomato Paste", icon: "🍅", category: "Produce" },
  { name: "Garlic", icon: "🧄", category: "Produce" },
  { name: "Onion", icon: "🧅", category: "Produce" },
  { name: "Avocado", icon: "🥑", category: "Produce" },
  { name: "Spinach", icon: "🥬", category: "Produce" },
  { name: "Parmesan", icon: "🧀", category: "Dairy" },
  { name: "Butter", icon: "🧈", category: "Dairy" },
  { name: "Eggs", icon: "🥚", category: "Dairy" },
  { name: "Olive Oil", icon: "🫒", category: "Spices" },
  { name: "Lemon", icon: "🍋", category: "Produce" },
  { name: "Basil", icon: "🌿", category: "Spices" },
  { name: "Chili Flakes", icon: "🌶️", category: "Spices" },
  { name: "Black Pepper", icon: "🧂", category: "Spices" }
];

const SUGGESTIONS_DATABASE = [
  "Garlic", "Garlic Powder", "Olive Oil", "Extra Virgin Olive Oil", "Onion", "Red Onion",
  "Tomatoes", "Tomato Paste", "Cherry Tomatoes", "Basil", "Oregano", "Thyme", "Rosmary",
  "Pasta", "Spaghetti", "Penne", "Rice", "Basmati Rice", "Ground Beef", "Chicken Breast",
  "Salmon Fillet", "Shrimp", "Parmesan", "Mozzarella", "Cheddar", "Butter", "Eggs",
  "Heavy Cream", "Avocado", "Lemon", "Lime", "Spinach", "Mushrooms", "Bell Pepper",
  "Chili Flakes", "Paprika", "Cumin", "Soy Sauce", "Honey", "Dijon Mustard"
];

export default function Main({ onSavedCountChange }) {
  const [ingredients, setIngredients] = useState([
    "Pasta",
    "Ground Beef",
    "Tomato Paste",
    "Garlic"
  ]);

  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [recipeShown, setRecipeShown] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  // Preference options
  const [cuisine, setCuisine] = useState("Any");
  const [mealType, setMealType] = useState("Any");
  const [dietary, setDietary] = useState("None");
  const [showPreferences, setShowPreferences] = useState(false);

  // Toast / Confetti state
  const [errorMsg, setErrorMsg] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

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

  // Handle Autocomplete filtering
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    if (val.trim().length >= 1) {
      const filtered = SUGGESTIONS_DATABASE.filter(
        (item) => item.toLowerCase().includes(val.toLowerCase()) && !ingredients.some((ing) => ing.toLowerCase() === item.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (item) => {
    handleAddIngredient(item);
    setInputValue("");
    setSuggestions([]);
  };

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
      // Trigger celebration confetti!
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
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
    if (inputValue) {
      handleAddIngredient(inputValue);
      setInputValue("");
      setSuggestions([]);
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

    const titleMatch = recipeShown.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].replace(/[👨‍🍳✨]/g, "").trim() : "Gourmet Recipe";

    const existingIndex = savedRecipes.findIndex((r) => r.content === recipeShown);

    if (existingIndex >= 0) {
      const updated = savedRecipes.filter((_, i) => i !== existingIndex);
      setSavedRecipes(updated);
      localStorage.setItem("chef_claude_saved_recipes", JSON.stringify(updated));
    } else {
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
      // Trigger confetti on save
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const isCurrentRecipeSaved = savedRecipes.some((r) => r.content === recipeShown);

  const loadingMessages = [
    { title: "Analyzing Ingredients...", subtitle: `Evaluating flavor pairings for ${ingredients.join(", ")}` },
    { title: "Crafting Culinary Balance...", subtitle: "Balancing aromatics, seasonings, and cooking techniques" },
    { title: "Writing Step-by-Step Directions...", subtitle: "Finalizing presentation notes and chef tips" }
  ];

  const filteredPresets = selectedCategory === "All"
    ? CATEGORIZED_PRESETS
    : CATEGORIZED_PRESETS.filter(p => p.category === selectedCategory);

  return (
    <main className="main-content">
      <Confetti active={showConfetti} />

      {/* Hero Header Section */}
      <section className="hero-section">
        <div className="hero-pill">
          <SparklesIcon className="sparkle-icon" /> AI-Powered Gourmet Kitchen
        </div>
        <h1 className="hero-title">What's in your pantry?</h1>
        <p className="hero-subtitle">
          Add your available ingredients below. Chef Claude will craft an incredible custom recipe tailored just for you.
        </p>

        {/* Form Input with Autocomplete */}
        <div className="form-autocomplete-container">
          <form onSubmit={handleSubmit} className="add-ingredient-form">
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="e.g. Fresh Garlic, Olive Oil, Salmon..."
                aria-label="Add ingredient"
                name="ingredient"
                value={inputValue}
                onChange={handleInputChange}
                className="ingredient-input"
                autoComplete="off"
              />
              {suggestions.length > 0 && (
                <ul className="autocomplete-dropdown">
                  {suggestions.map((item) => (
                    <li key={item} onClick={() => selectSuggestion(item)}>
                      <PlusIcon className="btn-icon-xs" /> {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button type="submit" className="add-btn">
              <PlusIcon className="btn-icon" />
              <span>Add Item</span>
            </button>
          </form>
        </div>

        {/* Error Toast */}
        {errorMsg && (
          <div className="toast-error" role="alert">
            <span>⚠️ {errorMsg}</span>
          </div>
        )}

        {/* Quick Add Presets with Category Filter Pills */}
        <div className="quick-presets">
          <div className="preset-categories-bar">
            {["All", "Proteins", "Produce", "Carbs", "Dairy", "Spices"].map((cat) => (
              <button
                key={cat}
                type="button"
                className={`category-pill ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="preset-chips-scroll">
            {filteredPresets.map((item) => {
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
          ingredients={ingredients}
        />
      )}
    </main>
  );
}
