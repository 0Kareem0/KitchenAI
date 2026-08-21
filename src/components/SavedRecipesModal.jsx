import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { CloseIcon, TrashIcon, BookmarkIcon, ChefHatIcon, CopyIcon, CheckIcon } from "./Icons";

export default function SavedRecipesModal({ isOpen, onClose, savedRecipes, removeSavedRecipe }) {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  if (!isOpen) return null;

  const activeRecipe = selectedRecipe !== null ? savedRecipes[selectedRecipe] : savedRecipes[0];

  const handleCopy = (recipeText, id) => {
    navigator.clipboard.writeText(recipeText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <BookmarkIcon className="modal-icon" />
            <h2>Saved Recipes Collection ({savedRecipes.length})</h2>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        {savedRecipes.length === 0 ? (
          <div className="modal-empty">
            <ChefHatIcon className="empty-icon" />
            <h3>No Saved Recipes Yet</h3>
            <p>Generate a recipe and click the "Save" heart icon to add it to your culinary collection.</p>
          </div>
        ) : (
          <div className="modal-body">
            <div className="modal-sidebar">
              {savedRecipes.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`saved-item-card ${activeRecipe?.id === item.id ? "active" : ""}`}
                  onClick={() => setSelectedRecipe(index)}
                >
                  <div className="saved-item-info">
                    <span className="saved-item-date">{item.date}</span>
                    <h4 className="saved-item-title">{item.title || `Recipe #${index + 1}`}</h4>
                    <p className="saved-item-ingredients">{item.ingredients?.slice(0, 3).join(", ")}...</p>
                  </div>
                  <button 
                    type="button"
                    className="delete-saved-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSavedRecipe(item.id);
                      if (activeRecipe?.id === item.id) {
                        setSelectedRecipe(null);
                      }
                    }}
                    title="Delete saved recipe"
                  >
                    <TrashIcon />
                  </button>
                </div>
              ))}
            </div>

            <div className="modal-detail">
              {activeRecipe ? (
                <>
                  <div className="modal-detail-toolbar">
                    <button 
                      type="button" 
                      className="recipe-action-btn"
                      onClick={() => handleCopy(activeRecipe.content, activeRecipe.id)}
                    >
                      {copiedId === activeRecipe.id ? <CheckIcon /> : <CopyIcon />}
                      <span>{copiedId === activeRecipe.id ? "Copied" : "Copy Recipe"}</span>
                    </button>
                  </div>
                  <div className="modal-detail-content">
                    <ReactMarkdown>{activeRecipe.content}</ReactMarkdown>
                  </div>
                </>
              ) : (
                <div className="modal-empty-detail">
                  <p>Select a recipe from the list to view instructions.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
