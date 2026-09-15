import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { CopyIcon, CheckIcon, HeartIcon, PrintIcon, ChefHatIcon, SparklesIcon, ClockIcon, UtensilsIcon, FlameIcon } from "./Icons";
import KitchenTimer from "./KitchenTimer";

export default function ClaudeRecipe({ recipe, onSaveRecipe, isSaved, ingredients = [] }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("recipe"); // 'recipe' | 'checklist' | 'timer' | 'nutrition'
  const [checkedIngredients, setCheckedIngredients] = useState({});

  const handleCopy = () => {
    navigator.clipboard.writeText(recipe);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleCheckIngredient = (index) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Estimate macros based on ingredients
  const estimatedCalories = Math.min(850, Math.max(380, ingredients.length * 110 + 150));
  const estimatedProtein = Math.min(52, Math.max(18, ingredients.length * 7 + 10));
  const estimatedCarbs = Math.min(75, Math.max(25, ingredients.length * 9 + 15));
  const estimatedFat = Math.min(32, Math.max(10, ingredients.length * 4 + 6));

  return (
    <section className="suggested-recipe-container" aria-live="polite">
      <div className="recipe-card">
        {/* Top Recipe Header */}
        <div className="recipe-header">
          <div className="recipe-brand">
            <span className="recipe-hat-badge"><ChefHatIcon className="hat-icon" /></span>
            <div>
              <span className="recipe-kicker"><SparklesIcon className="sparkle-icon" /> Michelin Standard</span>
              <h2 className="recipe-main-title">Chef Claude's Culinary Recommendation</h2>
            </div>
          </div>

          <div className="recipe-actions">
            <button 
              type="button" 
              className={`recipe-action-btn ${copied ? "copied" : ""}`}
              onClick={handleCopy}
              title="Copy recipe text"
            >
              {copied ? <CheckIcon className="btn-icon" /> : <CopyIcon className="btn-icon" />}
              <span>{copied ? "Copied!" : "Copy"}</span>
            </button>

            <button 
              type="button" 
              className={`recipe-action-btn save-btn ${isSaved ? "is-saved" : ""}`}
              onClick={onSaveRecipe}
              title={isSaved ? "Saved in collection" : "Save to favorites"}
            >
              <HeartIcon className="btn-icon" filled={isSaved} />
              <span>{isSaved ? "Saved" : "Save"}</span>
            </button>

            <button 
              type="button" 
              className="recipe-action-btn print-btn"
              onClick={handlePrint}
              title="Print recipe"
            >
              <PrintIcon className="btn-icon" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Quick Meta Badges */}
        <div className="recipe-meta-strip">
          <div className="meta-badge"><ClockIcon className="meta-icon" /> 25 mins total</div>
          <div className="meta-badge"><UtensilsIcon className="meta-icon" /> 2-3 Servings</div>
          <div className="meta-badge flame"><FlameIcon className="meta-icon" /> ~{estimatedCalories} kcal</div>
          <div className="meta-badge chef">👨‍🍳 Chef's Choice</div>
        </div>

        {/* Multi-Tab Navigation */}
        <div className="recipe-tabs-nav">
          <button 
            type="button" 
            className={`tab-nav-btn ${activeTab === "recipe" ? "active" : ""}`}
            onClick={() => setActiveTab("recipe")}
          >
            📖 Recipe & Directions
          </button>
          <button 
            type="button" 
            className={`tab-nav-btn ${activeTab === "checklist" ? "active" : ""}`}
            onClick={() => setActiveTab("checklist")}
          >
            🛒 Prep Checklist ({Object.keys(checkedIngredients).filter(k => checkedIngredients[k]).length}/{ingredients.length})
          </button>
          <button 
            type="button" 
            className={`tab-nav-btn ${activeTab === "timer" ? "active" : ""}`}
            onClick={() => setActiveTab("timer")}
          >
            ⏱️ Kitchen Timer
          </button>
          <button 
            type="button" 
            className={`tab-nav-btn ${activeTab === "nutrition" ? "active" : ""}`}
            onClick={() => setActiveTab("nutrition")}
          >
            📊 Nutrition & Macros
          </button>
        </div>

        {/* Tab Content 1: Markdown Recipe */}
        {activeTab === "recipe" && (
          <div className="recipe-markdown-body fade-in">
            <ReactMarkdown>{recipe}</ReactMarkdown>
          </div>
        )}

        {/* Tab Content 2: Interactive Checklist */}
        {activeTab === "checklist" && (
          <div className="recipe-checklist-body fade-in">
            <h3>🛒 Interactive Prep & Ingredients Checklist</h3>
            <p className="checklist-subtext">Check off each item as you measure and prep it in your kitchen.</p>
            <ul className="checklist-items">
              {ingredients.map((ing, idx) => {
                const isChecked = !!checkedIngredients[idx];
                return (
                  <li key={idx} className={`checklist-item ${isChecked ? "done" : ""}`} onClick={() => toggleCheckIngredient(idx)}>
                    <input 
                      type="checkbox" 
                      checked={isChecked} 
                      onChange={() => toggleCheckIngredient(idx)} 
                      id={`chk-${idx}`}
                    />
                    <label htmlFor={`chk-${idx}`}>{ing}</label>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Tab Content 3: Kitchen Timer */}
        {activeTab === "timer" && (
          <div className="recipe-timer-body fade-in">
            <KitchenTimer />
          </div>
        )}

        {/* Tab Content 4: Nutrition & Macros */}
        {activeTab === "nutrition" && (
          <div className="recipe-nutrition-body fade-in">
            <h3>📊 Estimated Nutritional Profile (Per Portion)</h3>
            <p className="nutrition-subtext">Estimated based on ingredients provided. Values may vary by portion size.</p>

            <div className="macros-grid">
              <div className="macro-card">
                <span className="macro-label">Calories</span>
                <span className="macro-value">{estimatedCalories} kcal</span>
                <div className="macro-bar"><div className="macro-fill calories" style={{ width: `${Math.min(100, (estimatedCalories / 800) * 100)}%` }}></div></div>
              </div>

              <div className="macro-card">
                <span className="macro-label">Protein</span>
                <span className="macro-value">{estimatedProtein} g</span>
                <div className="macro-bar"><div className="macro-fill protein" style={{ width: `${Math.min(100, (estimatedProtein / 60) * 100)}%` }}></div></div>
              </div>

              <div className="macro-card">
                <span className="macro-label">Carbohydrates</span>
                <span className="macro-value">{estimatedCarbs} g</span>
                <div className="macro-bar"><div className="macro-fill carbs" style={{ width: `${Math.min(100, (estimatedCarbs / 90) * 100)}%` }}></div></div>
              </div>

              <div className="macro-card">
                <span className="macro-label">Healthy Fats</span>
                <span className="macro-value">{estimatedFat} g</span>
                <div className="macro-bar"><div className="macro-fill fats" style={{ width: `${Math.min(100, (estimatedFat / 40) * 100)}%` }}></div></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}