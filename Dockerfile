FROM python:3.9-slim

# Install Node.js
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Install Python dependencies
RUN pip install numpy joblib scikit-learn

# Set the working directory
WORKDIR /app

# Copy application files
COPY . .

# Install Node.js dependencies
RUN npm install --legacy-peer-deps

# Ensure the uploads directory exists
RUN mkdir -p uploads && chmod -R 755 uploads

# Expose the application port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
