import joblib
import sys
import numpy as np
import json

try:
    # Load the saved KNN model
    # print("Loading KNN model...")
    knn = joblib.load('knn_model.pkl')

    # Get features from command-line arguments
    # print("Received arguments:", sys.argv[1])
    features = json.loads(sys.argv[1])
    # print("Parsed features:", features)

    # Reshape features
    features = np.array(features).reshape(1, -1)
    # print("Reshaped features:", features)

    # Predict price range
    predicted_price = knn.predict(features)
    print(predicted_price[0])  # Output prediction
except Exception as e:
    print(f"Error occurred: {e}", file=sys.stderr)
    sys.exit(1)
