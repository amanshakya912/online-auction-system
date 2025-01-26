import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

dataset = pd.read_csv('online-auction-system/input/train.csv')
correlation_matrix = dataset.corr()

# Plot the heatmap
plt.figure(figsize=(12, 8))
sns.heatmap(correlation_matrix, annot=True, cmap="coolwarm")
plt.title('Correlation Heatmap')
plt.show()
