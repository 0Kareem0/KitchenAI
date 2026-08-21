import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { CopyIcon, CheckIcon, HeartIcon, PrintIcon, ChefHatIcon, SparklesIcon } from "./Icons";

export default function ClaudeRecipe({ recipe, onSaveRecipe, isSaved }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(recipe);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="suggested-recipe-container" aria-live="polite">
      <div className="recipe-card">
        <div className="recipe-header">
          <div className="recipe-brand">
            <span className="recipe-hat-badge"><ChefHatIcon className="hat-icon" /></span>
            <div>
              <span className="recipe-kicker"><SparklesIcon className="sparkle-icon" /> Masterpiece Ready</span>
              <h2 className="recipe-main-title">Chef Claude Recommends</h2>
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

        <div className="recipe-markdown-body">
          <ReactMarkdown>{recipe}</ReactMarkdown>
        </div>
      </div>
    </section>
  );
}