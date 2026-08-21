export async function getRecipeFromMistral(ingredients, options = {}) {
  const HF_API_KEY = import.meta.env.VITE_HF_API_KEY;
  const endpoint = "https://router.huggingface.co/v1/chat/completions";

  const { cuisine = "Any", mealType = "Any", dietary = "None" } = options;

  if (HF_API_KEY) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "meta-llama/Llama-3.1-8B-Instruct", 
          messages: [
            {
              role: "system",
              content: "You are Chef Claude, an expert Michelin-star culinary chef. Format your responses in clean Markdown with clear section titles, prep time, ingredients list, step-by-step instructions, and chef tips."
            },
            {
              role: "user",
              content: `Create a delicious recipe using these available ingredients: ${ingredients.join(", ")}.${cuisine !== "Any" ? ` Preferred cuisine: ${cuisine}.` : ""}${mealType !== "Any" ? ` Meal type: ${mealType}.` : ""}${dietary !== "None" ? ` Dietary preference: ${dietary}.` : ""} You may assume standard pantry items like oil, salt, pepper, and water are available.`
            }
          ],
          max_tokens: 800
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.choices && data.choices[0]?.message?.content) {
          return data.choices[0].message.content;
        }
      }
    } catch (error) {
      console.warn("AI API request failed, switching to Chef Claude Fallback Generator:", error);
    }
  }

  // Smart Gourmet Recipe Fallback Generator
  return generateFallbackRecipe(ingredients, options);
}

function generateFallbackRecipe(ingredients, options = {}) {
  const { cuisine = "Gourmet", mealType = "Dinner", dietary = "Standard" } = options;
  const mainIng = ingredients[0] || "Chef's Special";
  const secIng = ingredients[1] || "Fresh Herbs";
  const thrdIng = ingredients[2] || "Pantry Spices";

  const titleCased = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  const mainName = titleCased(mainIng);
  const secName = titleCased(secIng);

  return `
# 👨‍🍳 Chef Claude's Signature ${mainName} & ${secName} Delicacy

> **Chef's Note:** A beautifully harmonized ${cuisine.toLowerCase() !== "any" ? cuisine : "artisan"} dish designed around your available ingredients. Rich in flavor, balanced in texture, and easy to prepare!

---

### ⏱️ Recipe Overview
* **Prep Time:** 12 minutes
* **Cook Time:** 20 minutes
* **Servings:** 2 - 3 portions
* **Difficulty:** Easy / Intermediate
* **Style:** ${cuisine !== "Any" ? cuisine : "Fusion"} ${mealType !== "Any" ? mealType : "Special"}

---

### 🛒 Ingredients Checklist

**Your Pantry Items:**
${ingredients.map(ing => `- **${titleCased(ing)}**`).join("\n")}

**Pantry Essentials (Assumed on hand):**
- 2 tbsp Olive Oil or Butter
- 2 cloves Garlic, finely minced (or powder)
- Salt and freshly cracked Black Pepper to taste
- 1/2 cup Water or Stock

---

### 🍳 Cooking Instructions

1. **Prep & Aromatics (5 mins)**
   - Clean and chop your **${mainIng}** and **${secIng}** into bite-sized pieces.
   - Heat 2 tablespoons of olive oil or butter in a skillet over medium heat. Add minced garlic and sauté until fragrant (about 1 minute).

2. **Searing & Flavor Base (7 mins)**
   - Add **${mainIng}** to the skillet. Cook for 5-7 minutes until caramelization begins, locking in natural flavors.
   - Season generously with salt, pepper, and your favorite pantry spices.

3. **Combining Ingredients (5 mins)**
   - Toss in ${ingredients.slice(1).map(ing => `**${ing}**`).join(" and ")}.
   - Reduce heat to low-medium, cover, and let simmer for 5-8 minutes so the flavors meld together harmoniously.

4. **Finishing & Plating (3 mins)**
   - Taste and adjust seasoning with a squeeze of fresh lemon or extra herbs if available.
   - Transfer to warm serving plates. Garnish with fresh herbs or a pinch of crushed black pepper.

---

### 💡 Chef Claude's Secret Tip
*To elevate this dish further, deglaze the skillet with a splash of white wine or vegetable stock right after searing to create a rich pan sauce!*
`;
}

