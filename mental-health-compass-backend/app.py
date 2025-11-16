# --- START: CRITICAL DIAGNOSTIC ---
# This code runs only once when the server starts.
# It will print the exact version of the Google AI library being used.
# If this version is low (e.g., 0.2.0), it PROVES the wrong environment is being used.
# A correct version should be 0.5.0 or higher.
try:
    import google.generativeai

    print("--- DIAGNOSTIC START ---")
    print(
        f"SUCCESS: Found google.generativeai version: {google.generativeai.__version__}"
    )
    print("--- DIAGNOSTIC END ---")
except Exception as e:
    print("--- DIAGNOSTIC START ---")
    print(f"CRITICAL FAILURE: Could not import google.generativeai. Error: {e}")
    print("--- DIAGNOSTIC END ---")
# --- END: CRITICAL DIAGNOSTIC ---


from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import os
import pickle
import numpy as np
from dotenv import load_dotenv

# Load environment and configure Gemini
import google.generativeai as genai

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY, transport="rest")

# Define safety settings BEFORE model initialization
safety_settings = [
    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
]

model = genai.GenerativeModel("gemini-1.0-pro", safety_settings=safety_settings)

app = Flask(__name__)
CORS(app)


@app.route("/")
def health_check():
    return "OK", 200


# --- CHAT FUNCTION ---
@app.route("/chat_real", methods=["POST"])
def chat_real():
    final_history_for_error_log = "History failed to build."
    try:
        print("--- DEBUG: /chat_real endpoint called ---")
        frontend_history = request.json["history"]
        print(f"--- DEBUG: Received history: {frontend_history}")
        clean_history = []
        for message in frontend_history:
            if (
                "Failed to get a response" in message["text"]
                or "Failed to fetch" in message["text"]
            ):
                continue
            current_role = "user" if message["sender"] == "user" else "model"
            if not clean_history or clean_history[-1]["role"] != current_role:
                clean_history.append(
                    {"role": current_role, "parts": [{"text": message["text"]}]}
                )

        final_history_for_error_log = [
            {
                "role": "user",
                "parts": [
                    {
                        "text": "You are 'Compass,' a kind, empathetic listening bot. Your purpose is to help users explore their feelings. Keep your responses short and conversational (1-3 sentences). Ask gentle, open-ended questions. Never give medical advice. Your goal is to listen and support. Your responses should be plain text, without any markdown."
                    }
                ],
            },
            {
                "role": "model",
                "parts": [
                    {"text": "Understood. I am Compass, and I am ready to listen."}
                ],
            },
        ] + clean_history

        print(f"--- DEBUG: Final history for Gemini: {final_history_for_error_log}")
        print("--- DEBUG: About to call Gemini API ---")
        try:
            response_stream = model.generate_content(
                final_history_for_error_log, stream=True
            )
            print("--- DEBUG: Gemini API call returned ---")
        except Exception as e:
            print("--- ERROR: Gemini API call failed ---")
            print(e)
            raise

        def generate():
            for chunk in response_stream:
                print(f"--- DEBUG: Streaming chunk: {chunk.text}")
                yield chunk.text

        return Response(generate(), mimetype="text/plain")
    except Exception as e:
        print(f"--- ERROR IN /chat_real ---")
        print(f"The exact error is: {e}")
        print("--- FAILING HISTORY ---")
        print(final_history_for_error_log)
        print("--- END HISTORY ---")
        return Response(f"Error: {e}", status=500)


# --- SUMMARIZE FUNCTION ---
@app.route("/summarize_chat", methods=["POST"])
def summarize_chat():
    try:
        frontend_history = request.json["history"]
        conversation_text = "\n".join(
            [
                f"{'User' if msg['sender'] == 'user' else 'Bot'}: {msg['text']}"
                for msg in frontend_history
            ]
        )
        summary_prompt = (
            "You have two tasks. First, analyze the following conversation and classify the user's likely mental state into one of three categories: Normal, Depression, or Severe. "
            "Second, write a gentle, one-paragraph summary for the user, reflecting on their feelings. "
            "Your entire response MUST be in the following format, with nothing else:\n"
            "[CLASSIFICATION]: YourClassificationHere\n[SUMMARY]: YourSummaryHere\n\n"
            f"Here is the conversation:\n{conversation_text}"
        )
        response = model.generate_content(
            summary_prompt, safety_settings=safety_settings
        )
        parts = response.text.split("[SUMMARY]:")
        prediction = parts[0].replace("[CLASSIFICATION]:", "").strip()
        summary = (
            parts[1].strip() if len(parts) > 1 else "Could not generate a summary."
        )
        if prediction not in ["Normal", "Depression", "Severe"]:
            prediction = "Normal"
        return jsonify({"summary": summary, "prediction": prediction})
    except Exception as e:
        print(f"--- ERROR IN /summarize_chat ---: {e}")
        return jsonify({"error": "Failed to summarize the chat."}), 500


# --- QUESTIONNAIRE PREDICTION ---
try:
    with open("model.pkl", "rb") as f:
        questionnaire_model = pickle.load(f)
    with open("scaler.pkl", "rb") as f:
        scaler = pickle.load(f)
    print("Questionnaire models loaded successfully.")
except FileNotFoundError:
    print("Warning: 'model.pkl' or 'scaler.pkl' not found.")
    questionnaire_model = None
    scaler = None


@app.route("/predict_questionnaire", methods=["POST"])
def predict_questionnaire():
    if not questionnaire_model or not scaler:
        return jsonify({"error": "Questionnaire model not loaded on server"}), 500
    try:
        data = request.get_json()
        features = np.array(data["features"]).reshape(1, -1)
        scaled_features = scaler.transform(features)
        prediction = int(questionnaire_model.predict(scaled_features)[0])
        labels = ["Normal", "Depression", "Severe"]
        result_label = (
            labels[prediction] if 0 <= prediction < len(labels) else "Unknown"
        )
        return jsonify({"prediction": result_label})
    except Exception as e:
        print(f"Error in /predict_questionnaire: {e}")
        return jsonify({"error": "Failed to process questionnaire"}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port, debug=False)
