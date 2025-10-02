# KitchenAI 🍳

A React application for managing kitchen ingredients and generating AI-powered recipe suggestions using Google's Gemini AI.

## Features

- ✅ Add and manage ingredients
- 🤖 AI-powered recipe generation using Google Gemini
- 📱 Responsive design
- ⚡ Real-time recipe suggestions
- 🎨 Modern, clean UI
- 🔄 Loading states and error handling

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file and add your Gemini API key:

```
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

### 4. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## How to Use

1. **Add Ingredients**: Type ingredient names in the input field and click "Add ingredient"
2. **Generate Recipes**: Click "Generate AI Recipes" to get AI-powered recipe suggestions
3. **View Recipes**: Browse through the generated recipes with cooking instructions, time estimates, and difficulty levels
4. **Clear All**: Use "Clear All" to start over with new ingredients

## Project Structure

```
src/
├── components/
│   ├── Entry.jsx          # Main ingredient and recipe interface
│   ├── Header.jsx         # Navigation header
│   ├── Footer.jsx         # Footer component
│   └── Page.jsx           # Main page layout
├── logic/
│   └── gemini.js          # Gemini AI integration logic
├── App.jsx                # Root component
└── index.css              # Global styles
```

## API Integration

The app integrates with Google's Gemini AI to provide:

- **Recipe Generation**: Creates 3 creative recipes based on your ingredients
- **Cooking Tips**: Get tips for specific ingredients (extensible feature)
- **Smart Suggestions**: AI considers ingredient combinations and cooking methods

## Technologies Used

- **React 19** - Frontend framework
- **Vite** - Build tool and dev server
- **Google Generative AI** - AI integration
- **CSS3** - Styling with modern features
- **ESLint** - Code linting

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GEMINI_API_KEY` | Your Google Gemini API key | Yes |

## Troubleshooting

### API Key Issues
- Ensure your `.env` file is in the root directory
- Check that your API key is valid and has proper permissions
- Restart the development server after adding the API key

### Common Issues
- **"Gemini API key not configured"**: Make sure your `.env` file contains the correct API key
- **Network errors**: Check your internet connection and API key validity
- **Empty responses**: Try with different ingredients or check the browser console for errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
