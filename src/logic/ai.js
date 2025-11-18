export async function getRecipeFromMistral(ingredients) {
  const HF_API_KEY = import.meta.env.VITE_HF_API_KEY;
  const endpoint = "https://router.huggingface.co/v1/chat/completions";

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
            role: "user",
            content: `Give me a recipe using these ingredients: ${ingredients.join(", ")}`
          }
        ],
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("AI ERROR:", err);
      throw new Error("Failed to fetch recipe");
    }

    const data = await response.json();
    return data.choices[0].message.content;

  } catch (error) {
    console.error("Error:", error);
    return "Error generating recipe.";
  }
}
