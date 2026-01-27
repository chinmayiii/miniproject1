from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import google.generativeai as genai

# ----------------------------------
# GEMINI SETUP
# ----------------------------------
GEMINI_API_KEY = "AIzaSyAV8TMbqo3ep11Sw5SV7Y64AYRb6ZVLb5c"
genai.configure(api_key=GEMINI_API_KEY, transport="rest")
gpt_model = genai.GenerativeModel("models/gemini-2.5-flash")

# ----------------------------------
# FLASK APP
import jwt
import datetime

# JWT secret key (use a strong random value in production)
JWT_SECRET = "your_jwt_secret_key"
JWT_ALGORITHM = "HS256"
JWT_EXP_DELTA_SECONDS = 3600
# ----------------------------------
app = Flask(__name__)
CORS(app)

# ----------------------------------
# MONGODB ATLAS SETUP
# ----------------------------------
from pymongo import MongoClient

MONGO_URI = "mongodb+srv://chinmayi:cudA4DfFCs2HxW3H@cluster0.tal0ccu.mongodb.net/?appName=Cluster0"  # <-- Paste your key here
client = MongoClient(MONGO_URI)
db = client["mental_health"]  # Use your database name
users_collection = db["users"]  # Use your collection name

# ----------------------------------
# LOAD ALL ML MODELS
# ----------------------------------
condition_model = pickle.load(open("condition_model.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))

questionnaire_model = pickle.load(open("model.pkl", "rb"))
scaler = pickle.load(open("scaler.pkl", "rb"))

# ----------------------------------
# CHAT MEMORY
# ----------------------------------
conversation_history = []


# ----------------------------------
# GEMINI HELPER
# ----------------------------------
def ask_gemini(prompt):
    response = gpt_model.generate_content(prompt)
    return response.text


# ----------------------------------
# CHAT ENDPOINT (Stores full chat)
# ----------------------------------
@app.route("/chat_real", methods=["POST"])
def chat_real():
    try:
        user_msg = request.json["message"]
        conversation_history.append({"user": user_msg})
        bot_reply = ask_gemini(
            f"You are a friendly and simple chatbot. Reply casually.\nUser: {user_msg}"
        )
        conversation_history.append({"bot": bot_reply})
        return jsonify({"reply": bot_reply})
    except Exception as e:
        return jsonify({"error": "Chat failed"}), 500


# ----------------------------------
# SUMMARY ENDPOINT
# ----------------------------------
@app.route("/summarize_chat", methods=["GET"])
def summarize_chat():
    try:
        conditions = []
        for msg in conversation_history:
            if "user" in msg:
                vector = vectorizer.transform([msg["user"]])
                pred = condition_model.predict(vector)[0]
                conditions.append(pred)
        full_chat_text = "\n".join([m.get("user", "") for m in conversation_history])
        final_summary = ask_gemini(
            f"Summarize this full chat in 5-7 clean lines:\n\n{full_chat_text}"
        )
        condition_summary = ask_gemini(
            f"Based on ML predicted emotional states {conditions}, write a psychological explanation."
        )
        return jsonify(
            {
                "conversation_summary": final_summary,
                "predicted_conditions": conditions,
                "condition_summary": condition_summary,
            }
        )
    except Exception:
        return jsonify({"error": "Summary failed"}), 500


# ----------------------------------
# QUESTIONNAIRE PREDICTION ENDPOINT
# ----------------------------------
def get_suggestions(prediction):
    if prediction == "Normal":
        return ["Go for a walk", "Listen to music", "Talk to friends"]
    elif prediction == "Depression":
        return ["Talk to a counselor", "Take frequent breaks", "Practice mindfulness"]
    else:
        return [
            "Seek professional help",
            "Talk to a therapist",
            "Get emotional support",
        ]


@app.route("/predict_questionnaire", methods=["POST"])
def predict_questionnaire():
    try:
        data = request.get_json()
        features = data.get("features")
        features_scaled = scaler.transform([features])
        prediction = questionnaire_model.predict(features_scaled)[0]
        if prediction == 0:
            label = "Normal"
        elif prediction == 1:
            label = "Depression"
        else:
            label = "Severe"
        suggestions = get_suggestions(label)
        return jsonify({"prediction": label, "suggestions": suggestions})
    except Exception:
        return jsonify({"error": "Prediction failed"}), 500


# ----------------------------------
# RUN APP
# ----------------------------------
@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400
    if users_collection.find_one({"email": email}):
        return jsonify({"error": "User already exists"}), 409
    users_collection.insert_one({"email": email, "password": password})
    return jsonify({"message": "Signup successful"}), 201


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400
    user = users_collection.find_one({"email": email})
    if user and user.get("password") == password:
        payload = {
            "email": email,
            "exp": datetime.datetime.utcnow()
            + datetime.timedelta(seconds=JWT_EXP_DELTA_SECONDS),
        }
        token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
        return jsonify({"message": "Login successful", "token": token}), 200
    return jsonify({"error": "Invalid credentials"}), 401


# Example protected endpoint
from functools import wraps


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split("Bearer ")[-1]
        if not token:
            return jsonify({"error": "Token is missing!"}), 401
        try:
            jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired!"}), 401
        except Exception:
            return jsonify({"error": "Token is invalid!"}), 401
        return f(*args, **kwargs)

    return decorated


# Example usage:
# @app.route('/protected', methods=['GET'])
# @token_required
# def protected():
#     return jsonify({'message': 'This is a protected route'})

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)
