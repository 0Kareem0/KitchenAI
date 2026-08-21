import React from "react";
import { ChefHatIcon, SparklesIcon } from "./Icons";

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-logo">
            <ChefHatIcon className="footer-hat-icon" />
            <span>Chef Claude AI</span>
          </div>
          <p className="footer-tagline">Elevating home cooking with artificial intelligence and gourmet taste.</p>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <h4>Features</h4>
            <ul>
              <li><a href="#add-ingredients">Ingredient Pairing</a></li>
              <li><a href="#quick-presets">Quick Prep Chips</a></li>
              <li><a href="#preferences">Dietary Filters</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Pantry AI</h4>
            <ul>
              <li><span className="footer-status-dot"></span> Llama 3.1 Instruct</li>
              <li><span>Powered by React & AI</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Chef Claude AI. All rights reserved. Crafted for food lovers.</p>
      </div>
    </footer>
  );
}