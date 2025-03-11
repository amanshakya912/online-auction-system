import sys
import joblib
import numpy as np
import json
import warnings

# Suppress warnings
warnings.filterwarnings("ignore", category=UserWarning)

try:
    # Load the trained model
    knn = joblib.load('knn_model2.pkl')
    
    # Parse input features from command-line arguments
    features = json.loads(sys.argv[1])
    features = np.array(features).reshape(1, -1)
    
    # Predict the price
    predicted_price = knn.predict(features)
    
    # Print only the predicted price
    print(predicted_price[0])
except Exception as e:
    # Print errors to stderr
    print(f"Error occurred: {e}", file=sys.stderr)
    sys.exit(1)