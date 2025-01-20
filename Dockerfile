# Use a base image with Node.js and Python
FROM node:18-bullseye

# Install system dependencies
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    pip3 install numpy joblib scikit-learn
# Set the working directory
WORKDIR /app

# Copy application files
COPY . .

# Install Node.js dependencies
RUN npm install --legacy-peer-deps

# Ensure the uploads directory exists
RUN mkdir -p uploads && chmod -R 755 uploads

# Expose the application port
EXPOSE 4000

# Start the application
CMD ["npm", "start"]
