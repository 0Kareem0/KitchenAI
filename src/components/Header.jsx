import React from "react";
import { ChefHatIcon, SparklesIcon, MoonIcon, SunIcon, BookmarkIcon } from "./Icons";

export default function Header({ theme, toggleTheme, savedCount, openSavedModal }) {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="brand-badge">
          <div className="logo-wrapper">
            <img src="/robot.png" alt="Chef Claude Logo" className="chef-logo-img" />
            <span className="chef-hat-badge"><ChefHatIcon className="hat-icon" /></span>
          </div>
          <div className="brand-text">
            <h1 className="brand-title">
              Chef Claude <span className="ai-tag"><SparklesIcon className="sparkle-icon" /> AI</span>
            </h1>
            <p className="brand-subtitle">Your Gourmet Culinary AI Assistant</p>
          </div>
        </div>

        <div className="header-actions">
          <button 
            className="action-btn saved-recipes-btn" 
            onClick={openSavedModal} 
            title="View Saved Recipes"
          >
            <BookmarkIcon className="btn-icon" />
            <span className="btn-text">Saved</span>
            {savedCount > 0 && <span className="saved-badge">{savedCount}</span>}
          </button>

          <button 
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