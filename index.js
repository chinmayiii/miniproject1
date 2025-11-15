// Import libraries
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

// --- START: NEW DEBUG CODE ---
// Let's check if the key is loaded
if (process.env.GEMINI_API_KEY) {
  console.log('--- DEBUG: SUCCESS! GEMINI_API_KEY was loaded. ---');
} else {
  console.error('--- DEBUG: ERROR! GEMINI_API_KEY is NOT loaded. Check Render environment variables. ---');
}
// --- END: NEW DEBUG CODE ---


// Initialize Express app
const app = express();
const port = process.env.PORT || 5000;
app.use(express.json()); // Allow server to read JSON
app.use(cors());         // Enable CORS for all routes

// --- CONFIGURE GEMINI ---
// Get API key from .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Get the model (we use the one that worked in Postman!)
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
// -------------------------

/**
 * This is your new API endpoint.
 * A frontend can send a POST request to http://localhost:5000/generate
 */
app.post('/generate', async (req, res) => {
  try {
    // Get the "prompt" from the request body
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // --- Call the real Gemini API ---
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    // ---------------------------------

    // Send the AI's text response back to the client
    res.json({ text: text });

  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});