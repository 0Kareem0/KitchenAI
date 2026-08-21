import React from "react";
import { SparklesIcon, MoonIcon, SunIcon, BookmarkIcon } from "./Icons";

export default function Header({ theme, toggleTheme, savedCount, openSavedModal }) {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="brand-badge">
          <img src="/robot.png" alt="Chef Claude Logo" className="chef-logo-img" />
          <h1 className="brand-title">
            Chef Claude <span className="ai-tag"><SparklesIcon className="sparkle-icon" /> AI</span>
          </h1>
        </div>

        <div className="header-actions">
          <button 
            type="button"
            className="action-btn saved-recipes-btn" 
            onClick={openSavedModal} 
            title="View Saved Recipes"
          >
            <BookmarkIcon className="btn-icon" />
            <span className="btn-text">Saved</span>
            {savedCount > 0 && <span className="saved-badge">{savedCount}</span>}
          </button>

          <button 
            type="button"
            className="action-btn theme-toggle-btn" 
            onClick={toggleTheme} 
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <SunIcon className="btn-icon sun" /> : <MoonIcon className="btn-icon moon" />}
          </button>
        </div>
      </div>
    </header>
  );
}