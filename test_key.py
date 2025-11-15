import google.generativeai as genai
import os

# --- PASTE YOUR NEWEST, MOST SECRET API KEY HERE ---
# Make sure this is a key you have NOT shared anywhere.
GEMINI_API_KEY = "AIzaSyD-_VLKY9qA_B4mtn9t-TlLPI7VDv8Hoak"

try:
    print("Attempting to connect to Google AI with your key...")
    genai.configure(api_key=GEMINI_API_KEY)

    model = genai.GenerativeModel(model_name="gemini-pro")

    print("Connection successful. Sending a test prompt...")
    response = model.generate_content("Can you hear me?")

    print("\n--- SUCCESS! ---")
    print("Your API key is working correctly.")
    print("The AI responded:", response.text)

except Exception as e:
    print("\n--- TEST FAILED ---")
    print("There is a problem with your API key or Google Cloud project.")
    print("The specific error is:")
    print(e)
