import joblib
import sys
import numpy as np
import json

try:
    knn = joblib.load('knn_model.pkl')
    features = json.loads(sys.argv[1])
    features = np.array(features).reshape(1, -1)
    predicted_price = knn.predict(features)
    print(predicted_price[0])
except Exception as e:
    print(f"Error occurred: {e}", file=sys.stderr)
    sys.exit(1)
