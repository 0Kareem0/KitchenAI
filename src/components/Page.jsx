import React, { useState, useEffect } from "react";
import Header from "./Header";
import Entry from "./Entry";
import Footer from "./Footer";
import SavedRecipesModal from "./SavedRecipesModal";

export default function Page() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("chef_claude_theme") || "dark";
  });

  const [savedCount, setSavedCount] = useState(0);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState([]);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("chef_claude_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const loadSavedRecipes = () => {
    try {
      const stored = localStorage.getItem("chef_claude_saved_recipes");
      const list = stored ? JSON.parse(stored) : [];
      setSavedRecipes(list);
      setSavedCount(list.length);
    } catch (e) {
      setSavedRecipes([]);
    }
  };

  const openSavedModal = () => {
    loadSavedRecipes();
    setIsSavedModalOpen(true);
  };

  const removeSavedRecipe = (id) => {
    const updated = savedRecipes.filter((item) => item.id !== id);
    setSavedRecipes(updated);
    setSavedCount(updated.length);
    localStorage.setItem("chef_claude_saved_recipes", JSON.stringify(updated));
  };

  return (
    <div className="app-layout">
      <Header 
        theme={theme} 
        toggleTheme={toggleTheme} 
        savedCount={savedCount}
        openSavedModal={openSavedModal}
      />

      <Entry 
        onSavedCountChange={setSavedCount}
      />

      <Footer />

      <SavedRecipesModal 
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedRecipes={savedRecipes}
        removeSavedRecipe={removeSavedRecipe}
      />
    </div>
  );
}