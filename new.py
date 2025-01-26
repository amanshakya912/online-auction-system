import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.neighbors import KNeighborsClassifier
import joblib  # For saving the model

dataset=pd.read_csv('online-auction-system/input/train.csv')
X=dataset.drop('price_range',axis=1)
y=dataset['price_range']
selected_features = ['battery_power','blue', 'dual_sim', 'fc', 'int_memory','ram','wifi','pc','n_cores','px_height','px_width']
X_selected = X[selected_features]
X_train, X_test, y_train, y_test = train_test_split(X_selected, y, test_size=0.33, random_state=101)

knn = KNeighborsClassifier(n_neighbors=10)
knn.fit(X_train, y_train)

accuracy = knn.score(X_test, y_test)
print(f"Accuracy with reduced features: {accuracy}")

joblib.dump(knn, 'knn_model2.pkl')

