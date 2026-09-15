# 👨‍🍳 Chef Claude AI — Gourmet Kitchen & Recipe Assistant

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Llama 3.1](https://img.shields.io/badge/AI-Llama_3.1_8B-FF4F00?style=for-the-badge&logo=meta&logoColor=white)](https://huggingface.co/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

An intelligent, luxury **AI-powered culinary assistant** built with React 19 and Meta Llama 3.1. Simply enter the ingredients available in your pantry, select your preferred cuisine style and dietary preferences, and let Chef Claude generate step-by-step gourmet recipes with prep checklists, kitchen timers, and nutritional macro estimates!

---

## ✨ Features

- 🧄 **Smart Pantry Inventory & Autocomplete**: Add ingredients easily with real-time autocomplete suggestions, deletable tag pills, and instant category filters (*Proteins 🥩, Produce 🥑, Carbs 🍝, Dairy 🧀, Spices 🌿*).
- 🤖 **AI Gourmet Recipe Engine**: Harnesses Hugging Face's Meta Llama-3.1 8B Instruct model with an intelligent offline culinary generator fallback.
- 🥗 **Culinary Customization**: Tailor recipes by **Cuisine Style** (*Italian, Asian, Mexican, Mediterranean, French, American*), **Meal Type** (*Dinner, Lunch, Breakfast, Snack*), and **Dietary Needs** (*Vegetarian, Low Carb, Gluten-Free, High Protein*).
- 📖 **Interactive Multi-Tab Recipe Studio**:
  - 📖 **Directions**: Rendered Markdown with clear prep instructions and chef notes.
  - 🛒 **Interactive Checklist**: Check off ingredients as you measure and prep in your kitchen.
  - ⏱️ **Interactive Kitchen Timer**: Built-in countdown timer widget with quick preset intervals (2m, 5m, 10m, 15m, 25m).
  - 📊 **Nutrition & Macro Gauges**: Estimated breakdown of Calories (~kcal), Protein, Carbs, and Fats.
- 🎨 **Obsidian Glassmorphic Aesthetic**: Luxury dark obsidian theme default with a single-click Parchment Light Mode toggle, responsive mobile navbar, and celebration confetti particle effects.
- 🔖 **Saved Recipes Collection**: Store your favorite recipes persistently in `localStorage`, complete with copy-to-clipboard and print features.

---

## 🛠️ Tech Stack

- **Frontend Core**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/)
- **Design & Styling**: Custom HSL Vanilla CSS Design System (Glassmorphism, Dark/Light Themes, Micro-animations)
- **Typography**: Google Fonts (*Outfit, Plus Jakarta Sans, Playfair Display*)
- **Markdown Rendering**: [`react-markdown`](https://github.com/remarkjs/react-markdown)
- **AI Backend / API**: [Hugging Face Inference API](https://huggingface.co/docs/api-inference/index) (`meta-llama/Llama-3.1-8B-Instruct`)
- **Storage**: `localStorage` (Persistent user preferences & saved recipes)

---

## 🚀 Quick Start

### 1. Prerequisites
Ensure you have **Node.js** (v18+) installed on your machine.

### 2. Clone Repository & Install Dependencies
```bash
git clone https://github.com/0Kareem0/KitchenAI.git
cd KitchenAI
npm install
```

### 3. Configure Environment Variables (Optional)
Create a `.env` file in the root directory:
```env
VITE_HF_API_KEY=your_hugging_face_api_key_here
```
*(Note: If no API key is specified, Chef Claude automatically uses its built-in client-side fallback generator to curate recipes!)*

### 4. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```text
chefClaude/
├── public/
│   └── robot.png
├── src/
│   ├── components/
│   │   ├── ClaudeRecipe.jsx        # Multi-tab recipe display card
│   │   ├── Confetti.jsx            # Celebration particle burst component
│   │   ├── Entry.jsx               # Hero input, quick presets & main controller
│   │   ├── Footer.jsx              # Responsive app footer
│   │   ├── Header.jsx              # Glassmorphic navbar & theme toggle
│   │   ├── Icons.jsx               # Reusable inline SVG icons
│   │   ├── IngredientsList.jsx     # Ingredient tag inventory & CTA card
│   │   ├── KitchenTimer.jsx        # Interactive kitchen countdown timer widget
│   │   ├── Page.jsx                # Layout root & theme manager
│   │   └── SavedRecipesModal.jsx   # Saved recipes collection modal drawer
│   ├── logic/
│   │   └── ai.js                   # Hugging Face AI API integration & fallback generator
│   ├── App.jsx                     # Entry React component
│   ├── index.css                   # Custom luxury design system & responsive CSS
│   └── main.jsx                    # Vite React DOM root
├── index.html                      # SEO metadata & Google Fonts
└── package.json
```

---

## 🌐 Live Demo

Explore the live application on Vercel:  
🔗 **[KitchenAI Live Demo](https://kitchen-ai-seven.vercel.app/)**

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.

Developed with ❤️ by **[Kareem](https://github.com/0Kareem0)**
