import React from "react"
import { generateRecipeSuggestions, isGeminiConfigured } from "../logic/gemini.js"

export default function Main() {
    const [ingredients, setIngredients] = React.useState([])
    const [recipes, setRecipes] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(null)
    const [showRecipes, setShowRecipes] = React.useState(false)

    const ingredientsListItems = ingredients.map(ingredient => (
        <li key={ingredient}>{ingredient}</li>
    ))

    function handleSubmit(event) {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const newIngredient = formData.get("ingredient")
        if (newIngredient && newIngredient.trim()) {
            setIngredients(prevIngredients => [...prevIngredients, newIngredient.trim()])
            event.currentTarget.reset()
        }
    }

    async function handleGenerateRecipes() {
        if (ingredients.length === 0) {
            setError("Please add some ingredients first!")
            return
        }

        if (!isGeminiConfigured()) {
            setError("Gemini API key not configured. Please set VITE_GEMINI_API_KEY in your environment variables.")
            return
        }

        setLoading(true)
        setError(null)
        setShowRecipes(false)

        try {
            const recipeData = await generateRecipeSuggestions(ingredients)
            setRecipes(recipeData.recipes || [])
            setShowRecipes(true)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    function clearIngredients() {
        setIngredients([])
        setRecipes([])
        setShowRecipes(false)
        setError(null)
    }

    return (
        <main className="main-content">
            <div className="ingredients-section">
                <h2>Add Your Ingredients</h2>
                <form onSubmit={handleSubmit} className="add-ingredient-form">
                    <input
                        type="text"
                        placeholder="e.g. oregano, chicken, tomatoes"
                        aria-label="Add ingredient"
                        name="ingredient"
                        required
                    />
                    <button type="submit">Add ingredient</button>
                </form>
                
                {ingredients.length > 0 && (
                    <div className="ingredients-list">
                        <h3>Your Ingredients:</h3>
                        <ul>
                            {ingredientsListItems}
                        </ul>
                        <div className="ingredients-actions">
                            <button 
                                onClick={handleGenerateRecipes} 
                                disabled={loading}
                                className="generate-btn"
                            >
                                {loading ? "Generating Recipes..." : "Generate AI Recipes"}
                            </button>
                            <button onClick={clearIngredients} className="clear-btn">
                                Clear All
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <div className="error-message">
                    <p>{error}</p>
                </div>
            )}

            {showRecipes && recipes.length > 0 && (
                <div className="recipes-section">
                    <h2>AI Recipe Suggestions</h2>
                    <div className="recipes-grid">
                        {recipes.map((recipe, index) => (
                            <div key={index} className="recipe-card">
                                <h3>{recipe.name}</h3>
                                <p className="recipe-description">{recipe.description}</p>
                                <div className="recipe-meta">
                                    <span className="cooking-time">⏱️ {recipe.cookingTime}</span>
                                    <span className="difficulty">📊 {recipe.difficulty}</span>
                                </div>
                                <div className="recipe-instructions">
                                    <h4>Instructions:</h4>
                                    <p>{recipe.instructions}</p>
                                </div>
                                {recipe.additionalIngredients && recipe.additionalIngredients.length > 0 && (
                                    <div className="additional-ingredients">
                                        <h4>Additional ingredients needed:</h4>
                                        <ul>
                                            {recipe.additionalIngredients.map((ingredient, idx) => (
                                                <li key={idx}>{ingredient}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </main>
    )
}