import google.generativeai as genai

# --- PASTE YOUR NEWEST, MOST SECRET API KEY HERE ---
GEMINI_API_KEY = "AIzaSyAs-I4QhJRD4-X4OBbpLbVKOoccooFthLo"

print("--- Step 1: Configuring API Key ---")
try:
    genai.configure(api_key=GEMINI_API_KEY)
    print("API Key configured successfully.")
except Exception as e:
    print(f"Failed to configure API key. Error: {e}")
    exit()

print("\n--- Step 2: Listing Models Available to Your Key ---")
print("The following models support content generation for your key:")
try:
    found_models = False
    for m in genai.list_models():
        if "generateContent" in m.supported_generation_methods:
            print(f"  - {m.name}")
            found_models = True
    if not found_models:
        print("\nERROR: No usable models were found for your API key.")
        print(
            "This strongly suggests an issue with your Google Cloud project setup or billing."
        )
        print(
            "Please ensure the 'Vertex AI API' is enabled AND a billing account is linked to your project."
        )

except Exception as e:
    print(f"\nERROR: Could not retrieve the list of models. The error is:")
    print(e)
