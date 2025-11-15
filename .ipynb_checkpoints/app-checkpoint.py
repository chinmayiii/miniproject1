import joblib
from flask import Flask, request, jsonify
import numpy as np
import warnings

# Suppress warnings for cleaner output
warnings.filterwarnings('ignore')

# Initialize the Flask application
app = Flask(__name__)

# --- Load Models and Vectorizer ---
# This part runs only once when the server starts.
try:
    # Load the model for the questionnaire
    questionnaire_model = joblib.load('questionnaire_model.joblib')
    print("Questionnaire model loaded successfully.")

    # Load the model and vectorizer for the chatbot
    # Note: We load the vectorizer and model separately, as saved in your notebook.
    chatbot_model = joblib.load('chatbot_model.joblib')
    tfidf_vectorizer = joblib.load('tfidf_vectorizer.joblib')
    print("Chatbot model and TF-IDF vectorizer loaded successfully.")

except FileNotFoundError as e:
    print(f"--- ERROR: A model file was not found. ---")
    print(f"Please make sure 'questionnaire_model.joblib', 'chatbot_model.joblib', and 'tfidf_vectorizer.joblib' are in the same folder as app.py.")
    print(f"Details: {e}")
    # Exit if models can't be loaded, as the app is useless without them.
    exit()


# --- Define API Endpoints ---

@app.route('/')
def home():
    """A simple welcome message to confirm the API is running."""
    return "Mental Health Compass API is running!"

# Endpoint for the questionnaire
@app.route('/predict_questionnaire', methods=['POST'])
def predict_questionnaire():
    """
    Receives questionnaire answers and returns a prediction.
    The incoming JSON should look like:
    {
        "features": [val1, val2, val3, ...]
    }
    """
    try:
        data = request.get_json(force=True)
        # The features must be in the same order and format as your training data.
        features = np.array(data['features']).reshape(1, -1)
        
        prediction = questionnaire_model.predict(features)
        
        # Return the prediction as a JSON object
        return jsonify({'prediction': prediction.tolist()})
    except Exception as e:
        return jsonify({'error': str(e)}), 400 # Bad Request

# Endpoint for the chatbot
@app.route('/predict_chat', methods=['POST'])
def predict_chat():
    """
    Receives a text message and returns a prediction.
    The incoming JSON should look like:
    {
        "text": "some user message"
    }
    """
    try:
        data = request.get_json(force=True)
        user_text = data['text']
        
        # 1. Transform the user's text using the loaded vectorizer
        text_vector = tfidf_vectorizer.transform([user_text])
        
        # 2. Predict using the chatbot model
        prediction = chatbot_model.predict(text_vector)
        
        # Return the prediction as a JSON object
        return jsonify({'prediction': prediction.tolist()})
    except Exception as e:
        return jsonify({'error': str(e)}), 400 # Bad Request

# --- Run the App ---
if __name__ == '__main__':
    # Run the server on port 5000 and enable debug mode for development
    app.run(port=5000, debug=True)