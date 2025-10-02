import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const modelName = "gemini-2.0-flash-lite";
/**
 * Generate recipe suggestions based on provided ingredients
 * @param {string[]} ingredients - Array of ingredient names
 * @returns {Promise<Object>} Recipe suggestions with title, description, and instructions
 */
export async function generateRecipeSuggestions(ingredients) {
  try {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      throw new Error('Gemini API key not found. Please set VITE_GEMINI_API_KEY in your environment variables.');
    }

    const model = genAI.getGenerativeModel({ model: modelName });
    
    const prompt = `You are a professional chef and cooking assistant. Based on the following ingredients: ${ingredients.join(', ')}, suggest 3 creative and delicious recipes. 

For each recipe, provide:
1. Recipe name
2. Brief description (1-2 sentences)
3. Complete cooking instructions
4. Estimated cooking time
5. Difficulty level (Easy/Medium/Hard)
6. Any additional ingredients needed (if any)

Format the response as a JSON object with this structure:
{
  "recipes": [
    {
      "name": "Recipe Name",
      "description": "Brief description",
      "instructions": "Step-by-step instructions",
      "cookingTime": "X minutes",
      "difficulty": "Easy/Medium/Hard",
      "additionalIngredients": ["ingredient1", "ingredient2"]
    }
  ]
}

Make the recipes practical and achievable with the given ingredients.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to parse JSON response
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.warn('Failed to parse JSON response, returning raw text:', parseError);
    }
    
    // Fallback: return structured response with raw text
    return {
      recipes: [{
        name: "AI Recipe Suggestion",
        description: "Based on your ingredients",
        instructions: text,
        cookingTime: "Varies",
        difficulty: "Medium",
        additionalIngredients: []
      }]
    };
    
  } catch (error) {
    console.error('Error generating recipe suggestions:', error);
    throw new Error(`Failed to generate recipe suggestions: ${error.message}`);
  }
}

/**
 * Get cooking tips and techniques for specific ingredients
 * @param {string} ingredient - The ingredient to get tips for
 * @returns {Promise<string>} Cooking tips and techniques
 */
export async function getCookingTips(ingredient) {
  try {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      throw new Error('Gemini API key not found. Please set VITE_GEMINI_API_KEY in your environment variables.');
    }

    const model = genAI.getGenerativeModel({ model: modelName });
    
    const prompt = `Provide cooking tips and techniques for ${ingredient}. Include:
1. Best cooking methods
2. Preparation tips
3. Storage advice
4. Common mistakes to avoid
5. Flavor pairing suggestions

Keep the response concise and practical.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
    
  } catch (error) {
    console.error('Error getting cooking tips:', error);
    throw new Error(`Failed to get cooking tips: ${error.message}`);
  }
}

/**
 * Check if Gemini API is properly configured
 * @returns {boolean} True if API key is available
 */
export function isGeminiConfigured() {
  return !!import.meta.env.VITE_GEMINI_API_KEY;
}
