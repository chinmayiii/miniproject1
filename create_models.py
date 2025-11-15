# filepath: c:\Users\smile\OneDrive\miniproject1\create_models.py
import pickle
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

print("Generating dummy data for questionnaire models...")

# Create some sample data that looks like your questionnaire
# 9 questions, answers from 1 to 4
# 100 sample users
X = np.random.randint(1, 5, size=(100, 9)) 
# Create corresponding labels (0=Normal, 1=Depression, 2=Severe)
# This logic is just for creating a working example
y = (np.sum(X, axis=1) / 9).astype(int)
y[y < 2] = 0
y[y == 2] = 1
y[y > 2] = 2

print("Training a simple model...")

# Create and fit the scaler
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Create and train the model
model = LogisticRegression(max_iter=1000)
model.fit(X_scaled, y)

print("Saving model.pkl and scaler.pkl...")

# Save the scaler
with open('scaler.pkl', 'wb') as f:
    pickle.dump(scaler, f)

# Save the model
with open('model.pkl', 'wb') as f:
    pickle.dump(model, f)

print("Done! The model files have been created successfully.")