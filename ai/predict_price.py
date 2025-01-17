import joblib
import sys
import numpy as np
import json

print('working')  # To verify the script is running

# Load the saved KNN model
knn = joblib.load('knn_model.pkl')

# Get features from command-line arguments
features = json.loads(sys.argv[1])
features = np.array(features).reshape(1, -1)

# Predict price range
predicted_price = knn.predict(features)

# Output the prediction
print(predicted_price[0])
